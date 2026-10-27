<h1>Gestión de inventario</h1>
<h2>Resumen Ejecutivo</h2>
<p>Aplicación web para gestionar el inventario de un pequeño negocio, dirigida a la persona encargada del control de existencias. Sustituye el registro manual de productos y movimientos por un sistema que mantiene las cantidades disponibles actualizadas y permite consultar el historial de entradas y salidas de cada producto.</p>
<h2>Problema</h2>
<p>Actualmente los productos y sus movimientos se registran manualmente, lo que dificulta mantener las existencias actualizadas y comprobar los movimientos realizados. El registro manual no valida operaciones: nada impide anotar una salida superior a lo disponible, y no existe una fuente única de verdad sobre el inventario ni un historial consultable por producto. Las soluciones empleadas habitualmente (hojas de cálculo o cuadernos) no están diseñadas para aplicar reglas de negocio ni para mantener la consistencia entre movimientos y existencias.</p>
<h2>Público Objetivo</h2>
<ul>
<li><strong>Persona encargada del inventario</strong>: Necesita registrar productos con código único, nombre y unidad de medida, y controlar entradas y salidas sin errores. Requiere consultar existencias actualizadas e historial por producto para responder con rapidez y evitar descuadres.</li>
</ul>
<h2>Propuesta de Valor</h2>
<p>Centraliza el catálogo de productos y el control de inventario en una única aplicación web con reglas de negocio aplicadas de forma automática: cada movimiento aceptado actualiza las existencias y toda salida superior a la cantidad disponible se rechaza con aviso al usuario, manteniendo las existencias intactas. Frente al registro manual, el sistema tiene como objetivo mantener la consistencia de las existencias, ofrecer trazabilidad por producto (tipo, cantidad y fecha) y permitir consultar el inventario actualizado.</p>
<h2>Capacidades Clave</h2>
<ol>
<li><strong>Catálogo de productos</strong>: Registro de productos con código único, nombre y unidad de medida.</li>
<li><strong>Registro de entradas y salidas</strong>: Movimientos asociados a un producto con cantidad mayor que cero.</li>
<li><strong>Actualización automática de existencias</strong>: Cada movimiento aceptado actualiza las cantidades disponibles del producto.</li>
<li><strong>Validación de salidas</strong>: Rechazo de salidas superiores a la cantidad disponible, con aviso al usuario y existencias sin cambios.</li>
<li><strong>Consulta de inventario actualizado</strong>: Vista del estado actual de existencias por producto.</li>
<li><strong>Historial de movimientos por producto</strong>: Consulta de tipo de movimiento, cantidad y fecha.</li>
</ol>
<h2>Casos de Uso Principales</h2>
<ul>
<li>Cuando la persona encargada recibe mercancía, puede registrar una entrada indicando producto y cantidad mayor que cero para que las existencias se actualicen automáticamente.</li>
<li>Cuando se solicita retirar producto, la persona encargada puede registrar una salida; si la cantidad supera lo disponible, la aplicación la rechaza, informa del motivo y mantiene las existencias sin cambios.</li>
<li>Cuando se necesita verificar el estado del negocio, la persona encargada puede consultar el inventario actualizado para conocer las cantidades disponibles.</li>
<li>Cuando se requiere auditar un producto, la persona encargada puede consultar su historial de movimientos con tipo, cantidad y fecha para revisar entradas y salidas.</li>
</ul>
<h2>Alcance</h2>
<h3>Dentro del Alcance</h3>
<ul>
<li>Catálogo de productos con código único, nombre y unidad de medida.</li>
<li>Registro de entradas y salidas con cantidad mayor que cero.</li>
<li>Actualización de existencias ante cada movimiento aceptado.</li>
<li>Rechazo de salidas superiores a la cantidad disponible, con aviso al usuario y sin modificar existencias.</li>
<li>Consulta del inventario actualizado.</li>
<li>Consulta del historial de movimientos por producto (tipo, cantidad y fecha).</li>
</ul>
<h3>Fuera del Alcance</h3>
<ul>
<li>Facturación.</li>
<li>Contabilidad.</li>
<li>Gestión de compras.</li>
</ul>
<h3>Supuestos y Dependencias</h3>
<ul>
<li>El negocio dispone de acceso a internet y de un navegador para usar la aplicación web.</li>
<li>La persona encargada es la responsable de registrar productos y movimientos.</li>
<li>El código de producto es único dentro del catálogo; la aplicación comprueba su unicidad al registrar el producto y rechaza códigos duplicados.</li>
<li>La unidad de medida se registra como atributo del producto; no se contemplan conversiones entre unidades.</li>
</ul>
<h2>Métricas de Éxito</h2>
<ul>
<li><strong>Unicidad de código de producto</strong>: La aplicación rechaza el registro de un producto cuyo código ya exista en el catálogo.</li>
<li><strong>Validación de cantidades</strong>: La aplicación acepta únicamente movimientos con cantidad mayor que cero.</li>
<li><strong>Actualización de existencias</strong>: Tras cada movimiento aceptado, las existencias del producto reflejan la cantidad resultante.</li>
<li><strong>Integridad de existencias</strong>: La aplicación rechaza toda salida superior a la cantidad disponible sin modificar las existencias.</li>
<li><strong>Trazabilidad</strong>: Es posible consultar el historial de movimientos por producto con tipo, cantidad y fecha.</li>
</ul>
<h2>Restricciones</h2>
<ul>
<li>El alcance se limita al catálogo de productos y al control de inventario; no se incluye facturación, contabilidad ni gestión de compras.</li>
<li>Toda salida superior a la cantidad disponible debe rechazarse y notificarse al usuario, sin alterar las existencias.</li>
<li>Solo se aceptan movimientos con cantidad mayor que cero.</li>
<li>El producto es una aplicación web, por lo que requiere navegador y conectividad.</li>
</ul>