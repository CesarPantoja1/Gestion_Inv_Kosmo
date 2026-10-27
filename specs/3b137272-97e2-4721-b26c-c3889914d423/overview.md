# Overview: Catálogo de Productos

## 1. Problema y Objetivo
El problema es la ausencia de una fuente única de verdad para los productos del negocio, lo que dificulta su identificación y gestión consistente. Actualmente, no existe un sistema que garantice la unicidad de los códigos de producto ni que centralice su información básica.

El objetivo principal de este módulo es establecer el Catálogo de Productos como la fuente única y autoritativa de todos los productos del negocio. Permitirá el registro de productos con un código único, nombre y unidad de medida, aplicando la regla de dominio de unicidad del código para prevenir duplicados. Además, facilitará la localización y consulta de productos existentes para su uso en operaciones posteriores.

## 2. Usuarios Involucrados
-   **Persona encargada del inventario**: Interactúa con este módulo para registrar nuevos productos, asegurar la unicidad de sus códigos y consultar la información básica de los artículos antes de realizar movimientos de inventario.

## 3. Alcance (Scope)
### Dentro del Alcance (In)
-   Registro de nuevos productos con código único, nombre y unidad de medida.
-   Validación de la unicidad del código de producto al momento del registro, rechazando duplicados.
-   Consulta y localización de productos existentes por código o nombre.
-   Visualización de los datos de un producto (código, nombre, unidad de medida).
-   Mantenimiento de la información básica de los productos como fuente de verdad para otros módulos.

### Fuera del Alcance (Out)
-   Gestión de existencias o cantidades disponibles de productos (esto es responsabilidad del módulo de Movimientos y Existencias).
-   Registro de movimientos de entrada o salida de productos.
-   Reportes analíticos complejos sobre el catálogo de productos.
-   Gestión de precios, proveedores o cualquier información comercial adicional del producto.
-   Conversión entre unidades de medida.
-   Modificación o eliminación de productos una vez registrados (solo se contempla el registro y consulta).

## 4. Dependencias y Restricciones
-   **Upstream**: Ninguna. Este es un módulo fundacional.