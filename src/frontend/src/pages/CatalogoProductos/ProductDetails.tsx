import { Product } from '../../api/client'

interface ProductDetailsProps {
  product: Product | null
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <aside className="panel details-panel" aria-labelledby="details-title">
      <header className="panel-header">
        <p className="eyebrow">Ficha</p>
        <h2 id="details-title">Detalle del producto</h2>
      </header>

      {product ? (
        <dl className="details-list">
          <div>
            <dt>Código</dt>
            <dd className="mono">{product.code}</dd>
          </div>
          <div>
            <dt>Nombre</dt>
            <dd>{product.name}</dd>
          </div>
          <div>
            <dt>Unidad de medida</dt>
            <dd>{product.unit_of_measure}</dd>
          </div>
        </dl>
      ) : (
        <p className="empty-state">Seleccione un producto</p>
      )}
    </aside>
  )
}
