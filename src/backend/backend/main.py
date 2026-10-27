import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.cat_logo_de_productos.routes import (
    router as cat_logo_de_productos_router,
)
from backend.database import init_db

init_db()

app = FastAPI(title="Gestión de inventario")

origins = os.getenv(
    "BACKEND_CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    cat_logo_de_productos_router,
    prefix="/api",
    tags=["Catálogo de Productos"],
)
app.include_router(
    cat_logo_de_productos_router,
    prefix="/api/cat_logo_de_productos",
    tags=["Catálogo de Productos"],
    include_in_schema=False,
)
app.include_router(
    cat_logo_de_productos_router,
    prefix="/api/catalogo_productos",
    tags=["Catálogo de Productos"],
    include_in_schema=False,
)
app.include_router(
    cat_logo_de_productos_router,
    include_in_schema=False,
)


@app.get("/health")
def health_check():
    return {"status": "ok"}
