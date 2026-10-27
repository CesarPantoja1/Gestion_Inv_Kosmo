# Tareas de Implementación: Catálogo de Productos

## Fase 1: Infraestructura Base, Configuración y Modelos de Datos

- [ ] **TASK-001: Configuración del proyecto backend (pyproject.toml)**
  - **Archivo:** `src/backend/pyproject.toml`
  - **Descripción:** Crear el archivo `pyproject.toml` con metadatos del proyecto, dependencias (`fastapi`, `uvicorn[standard]`, `sqlalchemy[asyncio]`, `aiosqlite`, `pydantic`, `pydantic-settings`) y dependencias de desarrollo (`pytest`, `pytest-asyncio`, `httpx`, `ruff`). Configurar `[tool.ruff]` (line-length, target-version) y `[tool.pytest.ini_options]` con `asyncio_mode = "auto"`.
  - **Criterio de Aceptación:** `pyproject.toml` existe, es válido y `pip install -e .` (o `uv sync`) resuelve dependencias sin errores.
  - **Dependencias:** Ninguna

- [ ] **TASK-002: Inicialización del paquete backend**
  - **Archivo:** `src/backend/backend/__init__.py`
  - **Descripción:** Crear el archivo `__init__.py` vacío que marca `backend` como paquete Python importable.
  - **Criterio de Aceptación:** `python -c "import backend"` ejecuta sin errores desde `src/backend/`.
  - **Dependencias:** TASK-001

- [ ] **TASK-003: Configuración de base de datos asíncrona**
  - **Archivo:** `src/backend/backend/database.py`
  - **Descripción:** Implementar `engine` (SQLAlchemy async con SQLite), `AsyncSessionLocal` (sessionmaker), `Base` (DeclarativeBase) y la dependencia `get_db()` como generador asíncrono que provee una `AsyncSession` y la cierra al finalizar. Incluir función `init_db()` que ejecute `Base.metadata.create_all` de forma asíncrona.
  - **Criterio de Aceptación:** Importar `database.py` no lanza errores; `get_db()` es un async generator válido usable con `Depends()`.
  - **Dependencias:** TASK-002

- [ ] **TASK-004: Modelo de datos Product**
  - **Archivo:** `src/backend/backend/catalogo_productos/models.py`
  - **Descripción:** Definir la entidad `Product` (stereotype: entity) heredando de `Base` con columnas: `id: int` (PK, autoincrement), `code: str` (VARCHAR(50), `unique=True`, `nullable=False`, `index=True`), `name: str` (VARCHAR(255), `nullable=False`), `unit_of_measure: str` (VARCHAR(20), `nullable=False`). Aplicar la restricción de unicidad a nivel de base de datos sobre `code` (Req 1.3, 1.5, 1.6, 1.7).
  - **Criterio de Aceptación:** `Product.__table__` contiene la columna `code` con `unique=True` y `String(50)`; `Product.__table__` contiene `unit_of_measure` como `String(20)`.
  - **Dependencias:** TASK-003

- [ ] **TASK-005: Inicialización del paquete catalogo_productos**
  - **Archivo:** `src/backend/backend/catalogo_productos/__init__.py`
  - **Descripción:** Crear `__init__.py` vacío que marca el submódulo como paquete Python.
  - **Criterio de Aceptación:** `from backend.catalogo_productos import models` ejecuta sin errores.
  - **Dependencias:** TASK-004

- [ ] **TASK-006: Esquemas Pydantic ProductCreate y ProductRead**
  - **Archivo:** `src/backend/backend/catalogo_productos/schemas.py`
  - **Descripción:** Definir `ProductCreate` (stereotype: schema) con campos `code: str` (`min_length=1`, `max_length=50`), `name: str` (`min_length=1`, `max_length=255`), `unit_of_measure: str` (`min_length=1`, `max_length=20`), todos obligatorios (Req 1.4). Definir `ProductRead` (stereotype: schema) con `id: int`, `code: str`, `name: str`, `unit_of_measure: str` y `model_config = ConfigDict(from_attributes=True)`.
  - **Criterio de Aceptación:** `ProductCreate(code="X", name="Y", unit_of_measure="Z")` valida correctamente; `ProductCreate(code="", ...)` lanza `ValidationError`; `ProductRead.model_validate(product_orm)` funciona con `from_attributes`.
  - **Dependencias:** TASK-005

## Fase 2: Lógica de Negocio y Endpoints API (Backend)

- [ ] **TASK-007: Repositorio ProductRepository**
  - **Archivo:** `src/backend/backend/catalogo_productos/services.py`
  - **Descripción:** Implementar la clase `ProductRepository` (stereotype: repository) con `__init__(self, db: AsyncSession)`. Métodos: `create_product(product_data: ProductCreate) -> Product` (inserta y hace `commit`/`refresh`), `get_product_by_code(code: str) -> Product | None` (consulta por `code` exacto), `get_products_by_name(name: str) -> List[Product]` (consulta con `ilike(f"%{name}%")` para búsqueda parcial, Req 2.2).
  - **Criterio de Aceptación:** Cada método ejecuta la consulta esperada contra la sesión; `get_products_by_name("par")` retorna coincidencias parciales.
  - **Dependencias:** TASK-004, TASK-006

- [ ] **TASK-008: Servicio ProductService con regla de unicidad**
  - **Archivo:** `src/backend/backend/catalogo_productos/services.py`
  - **Descripción:** Implementar la clase `ProductService` (stereotype: service) con `__init__(self, repository: ProductRepository)`. Métodos: `register_product(product_data: ProductCreate) -> Product` (verifica `get_product_by_code`; si existe lanza `ValueError("Código de producto duplicado")`; si no, llama `create_product`; captura `IntegrityError` de SQLAlchemy y lo re-lanza como `ValueError` para cubrir concurrencia, Req 1.2 y 1.7), `find_product_by_code(code: str) -> Product | None`, `search_products_by_name(name: str) -> List[Product]`.
  - **Criterio de Aceptación:** Registrar un código existente lanza `ValueError`; registrar código nuevo retorna `Product`; `IntegrityError` de la BD se traduce a `ValueError`.
  - **Dependencias:** TASK-007

- [ ] **TASK-009: Router ProductRouter con endpoints REST**
  - **Archivo:** `src/backend/backend/catalogo_productos/routes.py`
  - **Descripción:** Implementar `APIRouter(prefix="/products", tags=["catalogo_productos"])` con dependencia `get_service(db=Depends(get_db))` que construye `ProductService(ProductRepository(db))`. Endpoints: `POST /products` → `create_product(product_data: ProductCreate) -> ProductRead` (status 201; captura `ValueError` → `HTTPException(409, detail="Código de producto duplicado")`, Req 1.1, 1.2), `GET /products/{code}` → `get_product_by_code(code: str) -> ProductRead` (404 si no existe, Req 2.1, 3.1-3.3), `GET /products` → `search_products(name: str | None = None) -> List[ProductRead]` (si `name` vacío retorna lista vacía o todos según criterio; Req 2.2, 2.3).
  - **Criterio de Aceptación:** `POST /products` con código duplicado retorna 409; `GET /products/{code}` inexistente retorna 404; `GET /products?name=par` retorna lista filtrada.
  - **Dependencias:** TASK-008

- [ ] **TASK-010: Registro del router y arranque en main.py**
  - **Archivo:** `src/backend/backend/main.py`
  - **Descripción:** Crear la app `FastAPI(title="Catálogo de Productos")`, configurar `CORSMiddleware` (allow_origins=["*"] para desarrollo), registrar `product_router` con `app.include_router(...)`, y añadir `lifespan` que invoque `init_db()` al arrancar. Exponer `GET /health` → `{"status": "ok"}`.
  - **Criterio de Aceptación:** `uvicorn backend.main:app` arranca sin errores; `GET /health` retorna 200; `GET /docs` muestra los endpoints de productos.
  - **Dependencias:** TASK-009

## Fase 3: Componentes e Interfaces de Usuario (Frontend)

- [ ] **TASK-011: Configuración del proyecto frontend (package.json, tsconfig, vite)**
  - **Archivo:** `src/frontend/package.json`, `src/frontend/tsconfig.json`, `src/frontend/vite.config.ts`, `src/frontend/index.html`
  - **Descripción:** Crear `package.json` con dependencias `react`, `react-dom`, `axios` y devDeps `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`; scripts `dev`, `build`, `preview`. Configurar `tsconfig.json` (strict, jsx: react-jsx, moduleResolution: bundler). Configurar `vite.config.ts` con plugin React y proxy `/api` → `http://localhost:8000`. Crear `index.html` con `<div id="root">` y script `src/main.tsx`.
  - **Criterio de Aceptación:** `bun install` (o `npm install`) resuelve dependencias; `bun run build` compila sin errores de configuración.
  - **Dependencias:** Ninguna

- [ ] **TASK-012: Cliente HTTP y tipos TypeScript**
  - **Archivo:** `src/frontend/src/api/client.ts`
  - **Descripción:** Configurar instancia `axios` con `baseURL: "/api"`. Definir interfaces `Product`, `ProductCreate` (espejo de los schemas backend). Implementar funciones: `createProduct(data: ProductCreate): Promise<Product>` (POST `/products`), `getProductByCode(code: string): Promise<Product>` (GET `/products/{code}`), `searchProducts(name: string): Promise<Product[]>` (GET `/products?name=...`). Manejar errores extrayendo `error.response.data.detail`.
  - **Criterio de Aceptación:** Las tres funciones están tipadas y exportadas; un error 409 del backend se propaga con mensaje legible.
  - **Dependencias:** TASK-011

- [ ] **TASK-013: Componente ProductForm**
  - **Archivo:** `src/frontend/src/pages/CatalogoProductos/ProductForm.tsx`
  - **Descripción:** Componente React con formulario controlado para `code`, `name`, `unit_of_measure` (todos requeridos, `maxLength` 50/255/20 respectivamente). Al submit invoca `createProduct`; en éxito limpia el formulario y muestra mensaje de confirmación; en error 409 muestra "Código de producto duplicado" (Req 1.1, 1.2, 1.4).
  - **Criterio de Aceptación:** Enviar formulario vacío bloquea submit; código duplicado muestra mensaje de error; registro exitoso muestra confirmación.
  - **Dependencias:** TASK-012

- [ ] **TASK-014: Componente ProductSearch**
  - **Archivo:** `src/frontend/src/pages/CatalogoProductos/ProductSearch.tsx`
  - **Descripción:** Componente con input de búsqueda y botón. Permite buscar por código exacto (invoca `getProductByCode`) o por nombre parcial (invoca `searchProducts`). Renderiza tabla con columnas `code`, `name`, `unit_of_measure`. Si no hay resultados muestra "No se encontraron productos" (Req 2.1, 2.2, 2.3). Emite callback `onSelect(product)` al hacer clic en una fila.
  - **Criterio de Aceptación:** Búsqueda por código existente muestra una fila; búsqueda por nombre parcial muestra múltiples filas; búsqueda sin coincidencias muestra mensaje vacío.
  - **Dependencias:** TASK-012

- [ ] **TASK-015: Componente ProductDetails**
  - **Archivo:** `src/frontend/src/pages/CatalogoProductos/ProductDetails.tsx`
  - **Descripción:** Componente que recibe `product: Product | null` por props y muestra `code`, `name`, `unit_of_measure` en formato de ficha. Si `product` es `null` muestra placeholder "Seleccione un producto" (Req 3.1, 3.2, 3.3).
  - **Criterio de Aceptación:** Con producto seleccionado muestra los tres campos; sin selección muestra placeholder.
  - **Dependencias:** TASK-012

- [ ] **TASK-016: Composición de la página y App**
  - **Archivo:** `src/frontend/src/App.tsx`, `src/frontend/src/main.tsx`
  - **Descripción:** En `App.tsx` componer layout con `ProductForm`, `ProductSearch` y `ProductDetails`, gestionando estado `selectedProduct` compartido entre búsqueda y detalles. En `main.tsx` montar `<App />` en `#root` con `React.StrictMode`.
  - **Criterio de Aceptación:** La app renderiza los tres componentes; seleccionar un producto en la búsqueda actualiza `ProductDetails`.
  - **Dependencias:** TASK-013, TASK-014, TASK-015

## Fase 4: Integración, Verificación y Pruebas

- [ ] **TASK-017: Verificación de linting y compilación backend**
  - **Archivo:** `src/backend/` (todos los archivos Python)
  - **Descripción:** Ejecutar `ruff check .` y `ruff format --check .` en `src/backend/`; corregir cualquier violación. Verificar importación de la app con `python -c "from backend.main import app"`.
  - **Criterio de Aceptación:** `ruff check` retorna exit code 0; la app importa sin errores.
  - **Dependencias:** TASK-010

- [ ] **TASK-018: Pruebas de integración backend (pytest)**
  - **Archivo:** `src/backend/tests/test_catalogo_productos.py` (nuevo, dentro de `src/backend/`)
  - **Descripción:** Implementar pruebas con `httpx.AsyncClient` + `ASGITransport` sobre `app` con BD SQLite en memoria: (a) POST producto válido → 201 y datos correctos (Req 1.1); (b) POST código duplicado → 409 (Req 1.2); (c) POST sin campos → 422 (Req 1.4); (d) GET por código existente → 200 (Req 2.1, 3.1-3.3); (e) GET por código inexistente → 404; (f) GET `?name=` parcial → lista filtrada (Req 2.2); (g) GET sin coincidencias → lista vacía (Req 2.3).
  - **Criterio de Aceptación:** `pytest` ejecuta todas las pruebas en verde.
  - **Dependencias:** TASK-010

- [ ] **TASK-019: Verificación de compilación frontend**
  - **Archivo:** `src/frontend/` (todos los archivos TS/TSX)
  - **Descripción:** Ejecutar `tsc --noEmit` y `bun run build` (o `npm run build`) en `src/frontend/`; corregir errores de tipos o de bundling.
  - **Criterio de Aceptación:** `tsc --noEmit` retorna exit code 0; `bun run build` genera `dist/` sin errores.
  - **Dependencias:** TASK-016

- [ ] **TASK-020: Verificación end-to-end manual**
  - **Archivo:** N/A (verificación de integración)
  - **Descripción:** Levantar backend (`uvicorn backend.main:app --reload`) y frontend (`bun run dev`). Verificar flujo completo: registrar producto nuevo, intentar duplicado (ver mensaje), buscar por código, buscar por nombre parcial, seleccionar producto y ver detalles.
  - **Criterio de Aceptación:** Los cinco flujos del Requisito 1, 2 y 3 se ejecutan correctamente desde la UI contra el backend real.
  - **Dependencias:** TASK-017, TASK-018, TASK-019