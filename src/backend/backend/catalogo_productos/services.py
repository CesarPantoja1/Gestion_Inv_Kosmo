from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.catalogo_productos.models import Product
from backend.catalogo_productos.schemas import ProductCreate

DUPLICATE_CODE_MESSAGE = "Código de producto duplicado"


class ProductRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_product(self, product_data: ProductCreate) -> Product:
        product = Product(
            code=product_data.code,
            name=product_data.name,
            unit_of_measure=product_data.unit_of_measure,
        )
        self.db.add(product)
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise
        self.db.refresh(product)
        return product

    def get_product_by_code(self, code: str) -> Product | None:
        stmt = select(Product).where(Product.code == code)
        return self.db.execute(stmt).scalar_one_or_none()

    def get_products_by_name(self, name: str) -> list[Product]:
        stmt = (
            select(Product)
            .where(Product.name.ilike(f"%{name}%"))
            .order_by(Product.name, Product.code)
        )
        return list(self.db.execute(stmt).scalars().all())

    def get_all_products(self) -> list[Product]:
        stmt = select(Product).order_by(Product.name, Product.code)
        return list(self.db.execute(stmt).scalars().all())


class ProductService:
    def __init__(self, repository: ProductRepository) -> None:
        self.repository = repository

    def register_product(self, product_data: ProductCreate) -> Product:
        existing = self.repository.get_product_by_code(product_data.code)
        if existing is not None:
            raise ValueError(DUPLICATE_CODE_MESSAGE)
        try:
            return self.repository.create_product(product_data)
        except IntegrityError as exc:
            raise ValueError(DUPLICATE_CODE_MESSAGE) from exc

    def find_product_by_code(self, code: str) -> Product | None:
        return self.repository.get_product_by_code(code)

    def search_products_by_name(self, name: str) -> list[Product]:
        return self.repository.get_products_by_name(name)

    def list_products(self) -> list[Product]:
        return self.repository.get_all_products()
