# Requisitos: Catálogo de Productos

## Requisito 1: Registro de Nuevo Producto
**Objetivo:** Como persona encargada del inventario, quiero registrar un nuevo producto con un código único, nombre y unidad de medida, para establecerlo como parte del catálogo oficial.

#### Criterios de Aceptación
1. When a new product is registered with a unique code, name, and unit of measure, the system shall store the product information.
2. If a product registration attempt includes a code that already exists in the catalog, the system shall reject the registration and inform the user of the duplicate code.
3. The system shall ensure that the product code is unique across all registered products.
4. The system shall require a product code, name, and unit of measure for every new product registration.
5. The system shall accept product codes as alphanumeric (VARCHAR) up to 50 characters.
6. The system shall accept units of measure as text (VARCHAR) up to 20 characters.
7. If two users attempt to register the same product code simultaneously, the system shall enforce a unique constraint at the database level and the backend shall capture the error to inform the user.

## Requisito 2: Consulta de Productos por Código o Nombre
**Objetivo:** Como persona encargada del inventario, quiero localizar productos existentes por su código o nombre, para facilitar su identificación y uso en operaciones posteriores.

#### Criterios de Aceptación
1. When a user searches for a product by its unique code, the system shall display the product's code, name, and unit of measure.
2. When a user searches for products by a partial or full name, the system shall display all matching products, showing their code, name, and unit of measure.
3. If no product matches the provided search criteria, the system shall indicate that no products were found.

## Requisito 3: Visualización de Detalles del Producto
**Objetivo:** Como persona encargada del inventario, quiero visualizar los datos básicos de un producto, para confirmar su información antes de realizar movimientos de inventario.

#### Criterios de Aceptación
1. When a specific product is selected or identified, the system shall display its unique code.
2. When a specific product is selected or identified, the system shall display its name.
3. When a specific product is selected or identified, the system shall display its unit of measure.