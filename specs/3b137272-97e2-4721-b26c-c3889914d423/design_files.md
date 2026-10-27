src/
├── backend/
│   ├── pyproject.toml [Nuevo]
│   ├── backend/
│   │   ├── __init__.py [Nuevo]
│   │   ├── main.py [Nuevo]
│   │   ├── database.py [Nuevo]
│   │   └── catalogo_productos/ [Nuevo]
│   │       ├── __init__.py [Nuevo]
│   │       ├── models.py [Nuevo]
│   │       ├── schemas.py [Nuevo]
│   │       ├── services.py [Nuevo]
│   │       └── routes.py [Nuevo]
└── frontend/
    ├── index.html [Nuevo]
    ├── package.json [Nuevo]
    ├── tsconfig.json [Nuevo]
    ├── vite.config.ts [Nuevo]
    └── src/
        ├── main.tsx [Nuevo]
        ├── App.tsx [Nuevo]
        ├── api/
        │   └── client.ts [Nuevo]
        └── pages/
            └── CatalogoProductos/ [Nuevo]
                ├── ProductForm.tsx [Nuevo]
                ├── ProductSearch.tsx [Nuevo]
                └── ProductDetails.tsx [Nuevo]