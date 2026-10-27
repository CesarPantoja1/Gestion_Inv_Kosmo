# Roadmap: Gestión de inventario

## 1. Visión y Estrategia de Arquitectura

La plataforma se concibe como un **Monolito Modular** cuyo eje es el dominio de control de existencias de un pequeño negocio. El producto se organiza en torno a una única fuente de verdad del inventario: el catálogo de productos y los movimientos que lo afectan. La estrategia consiste en desacoplar funcionalmente el dominio en rebanadas verticales autónomas, donde cada módulo entrega valor de extremo a extremo (experiencia de usuario, reglas de negocio y persistencia de su propio estado) sin exponer detalles internos a los demás.

El principio rector es la **consistencia transaccional del inventario**: las reglas de negocio críticas (unicidad de código de producto, cantidades mayores que cero, rechazo de salidas superiores a lo disponible y actualización automática de existencias) residen en el núcleo del dominio y se aplican de forma centralizada, de modo que ningún módulo pueda dejar el inventario en un estado inconsistente. La trazabilidad (historial por producto con tipo, cantidad y fecha) se deriva de los mismos movimientos que actualizan las existencias, garantizando que existencias e historial nunca diverjan.

La descomposición sigue un orden incremental y acíclico: primero se establece el catálogo de productos como cimiento del dominio; sobre él se construye el motor de movimientos y actualización de existencias; y finalmente se añaden las capacidades de consulta (inventario actualizado e historial) que consumen el estado consolidado. Cada módulo es autónomo en su responsabilidad, se comunica con los demás mediante contratos de dominio claros y puede evolucionar sin reescribir el resto, manteniendo el despliegue como una sola aplicación web coherente.

---

## 2. Módulos (Specs)

### 1. Catálogo de Productos

- **Tipo de Módulo:** core_foundation
- **Propósito:** Ser la fuente única de verdad de los productos del negocio, gestionando su registro con código único, nombre y unidad de medida, y garantizando la unicidad del código como regla de dominio.
- **Interacciones de Usuario (Alto Nivel):**
  - La persona encargada registra un nuevo producto indicando código, nombre y unidad de medida para incorporarlo al catálogo.
  - La persona encargada intenta registrar un producto con un código ya existente y el sistema rechaza la operación informando del duplicado.
  - La persona encargada consulta y localiza productos del catálogo por código o nombre para identificar el artículo sobre el que operará.
  - La persona encargada visualiza los datos de un producto (código, nombre, unidad de medida) como referencia antes de registrar movimientos.
- **Dependencias:** Ninguna. (Módulo Fundacional)

### 2. Movimientos y Existencias

- **Tipo de Módulo:** feature_slice
- **Propósito:** Registrar entradas y salidas asociadas a un producto, aplicar las reglas de validación (cantidad mayor que cero y rechazo de salidas superiores a lo disponible) y actualizar automáticamente las existencias del producto ante cada movimiento aceptado.
- **Interacciones de Usuario (Alto Nivel):**
  - La persona encargada registra una entrada de mercancía indicando producto y cantidad mayor que cero, y el sistema actualiza las existencias automáticamente.
  - La persona encargada registra una salida de producto y el sistema descuenta la cantidad de las existencias disponibles.
  - La persona encargada intenta registrar una salida superior a la cantidad disponible y el sistema la rechaza, informa del motivo y mantiene las existencias sin cambios.
  - La persona encargada intenta registrar un movimiento con cantidad igual o menor que cero y el sistema lo rechaza con aviso al usuario.
- **Dependencias:**
  - **Catálogo de Productos**: Todo movimiento debe asociarse a un producto existente y validado por su código único; las existencias se calculan sobre las entidades del catálogo.

### 3. Consulta de Inventario e Historial

- **Tipo de Módulo:** reporting_analytics
- **Propósito:** Ofrecer la vista del estado actual de existencias por producto y el historial de movimientos por producto (tipo, cantidad y fecha), habilitando la verificación del negocio y la auditoría de cada artículo.
- **Interacciones de Usuario (Alto Nivel):**
  - La persona encargada consulta el inventario actualizado para conocer las cantidades disponibles de cada producto.
  - La persona encargada consulta el historial de movimientos de un producto concreto para revisar sus entradas y salidas con tipo, cantidad y fecha.
  - La persona encargada audita un producto filtrando su historial para verificar la trazabilidad de sus movimientos.
  - La persona encargada verifica, tras un movimiento, que las existencias mostradas reflejan la cantidad resultante esperada.
- **Dependencias:**
  - **Catálogo de Productos**: Requiere la identidad y los datos de los productos para presentar existencias e historial por artículo.
  - **Movimientos y Existencias**: Consume los movimientos registrados y las existencias actualizadas como fuente de los datos de consulta y trazabilidad.

---

## 3. Matriz de Dependencias y Orden de Ejecución

| Módulo | Módulos Upstream requeridos | Tipo de Acoplamiento | Razonamiento de Orden |
|---|---|---|---|
| Catálogo de Productos | Ninguno | Fundacional | Punto de entrada; define la entidad Producto y la regla de código único sobre la que se apoyan los movimientos y las consultas. |
| Movimientos y Existencias | Catálogo de Productos | Fuerte | Requiere las entidades de producto para asociar cada movimiento y calcular las existencias; aplica las reglas de validación y actualización automática. |
| Consulta de Inventario e Historial | Catálogo de Productos, Movimientos y Existencias | Fuerte | Consume los productos, los movimientos registrados y las existencias actualizadas para presentar el inventario y la trazabilidad por producto. |