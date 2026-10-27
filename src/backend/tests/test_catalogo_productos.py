import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.database import Base, get_db
from backend.main import app

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def create_product(code="PAR-001", name="Parlante", unit="unidad"):
    return client.post(
        "/api/products",
        json={"code": code, "name": name, "unit_of_measure": unit},
    )


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_product_returns_created_product():
    response = create_product()

    assert response.status_code == 201
    body = response.json()
    assert body["code"] == "PAR-001"
    assert body["name"] == "Parlante"
    assert body["unit_of_measure"] == "unidad"
    assert isinstance(body["id"], int)


def test_create_product_with_duplicate_code_returns_conflict():
    create_product()

    response = create_product(name="Otro parlante")

    assert response.status_code == 409
    assert response.json()["detail"] == "Código de producto duplicado"


def test_create_product_requires_all_fields():
    response = client.post("/api/products", json={"code": "PAR-001"})

    assert response.status_code == 422


def test_create_product_rejects_blank_values():
    response = create_product(code="   ")

    assert response.status_code == 422


@pytest.mark.parametrize(
    "prefix",
    [
        "/api",
        "/api/catalogo_productos",
        "/api/cat_logo_de_productos",
        "/",
    ],
)
def test_product_endpoints_available_under_expected_prefixes(prefix):
    create_response = client.post(
        f"{prefix.rstrip('/')}/products",
        json={"code": "ALI-9", "name": "Aceite", "unit_of_measure": "litro"},
    )
    assert create_response.status_code == 201

    response = client.get(f"{prefix.rstrip('/')}/products/ALI-9")
    assert response.status_code == 200
    assert response.json()["name"] == "Aceite"


def test_get_product_by_code_returns_details():
    create_product()

    response = client.get("/api/products/PAR-001")

    assert response.status_code == 200
    body = response.json()
    assert body["code"] == "PAR-001"
    assert body["name"] == "Parlante"
    assert body["unit_of_measure"] == "unidad"


def test_get_unknown_product_returns_not_found():
    response = client.get("/api/products/NO-EXISTE")

    assert response.status_code == 404


def test_search_products_by_partial_name():
    create_product(code="PAR-001", name="Parlante Bluetooth")
    create_product(code="PAR-002", name="Parlante de mesa")
    create_product(code="AUR-001", name="Auriculares")

    response = client.get("/api/products", params={"name": "parlante"})

    assert response.status_code == 200
    codes = {item["code"] for item in response.json()}
    assert codes == {"PAR-001", "PAR-002"}


def test_search_without_matches_returns_empty_list():
    create_product()

    response = client.get("/api/products", params={"name": "inexistente"})

    assert response.status_code == 200
    assert response.json() == []


def test_search_without_name_returns_all_products():
    create_product(code="A-1", name="Alfajor")
    create_product(code="B-1", name="Bebida")

    response = client.get("/api/products")

    assert response.status_code == 200
    assert len(response.json()) == 2
