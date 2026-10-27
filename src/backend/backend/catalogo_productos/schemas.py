from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProductCreate(BaseModel):
    code: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=255)
    unit_of_measure: str = Field(min_length=1, max_length=20)

    @field_validator("code", "name", "unit_of_measure")
    @classmethod
    def not_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("El campo no puede estar vacío")
        return value


class ProductRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    name: str
    unit_of_measure: str
