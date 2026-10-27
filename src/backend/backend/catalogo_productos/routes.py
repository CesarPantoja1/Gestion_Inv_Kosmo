from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.catalogo_productos.schemas import ProductCreate, ProductRead
from backend.catalogo_productos.services import (
    DUPLICATE_CODE_MESSAGE,
    ProductRepository,
    ProductService,
)
from backend.database import get_db

router = APIRouter(prefix="/products", tags=["catalogo_productos"])


def get_service(db: Session = Depends(get_db)) -> ProductService:
    return ProductService(ProductRepository(db))


@router.post("", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ProductCreate,
    service: ProductService = Depends(get_service),
) -> ProductRead:
    try:
        product = service.register_product(product_data)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=DUPLICATE_CODE_MESSAGE,
        ) from exc
    return ProductRead.model_validate(product)


@router.get("", response_model=list[ProductRead])
def search_products(
    name: str | None = Query(default=None),
    service: ProductService = Depends(get_service),
) -> list[ProductRead]:
    if name is None or not name.strip():
        products = service.list_products()
    else:
        products = service.search_products_by_name(name.strip())
    return [ProductRead.model_validate(product) for product in products]


@router.get("/{code}", response_model=ProductRead)
def get_product_by_code(
    code: str,
    service: ProductService = Depends(get_service),
) -> ProductRead:
    product = service.find_product_by_code(code)
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )
    return ProductRead.model_validate(product)
