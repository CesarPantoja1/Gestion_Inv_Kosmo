import { useState } from 'react'
import { Product } from './api/client'
import ProductDetails from './pages/CatalogoProductos/ProductDetails'
import ProductForm from './pages/CatalogoProductos/ProductForm'
import ProductSearch from './pages/CatalogoProductos/ProductSearch'

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <div className="app-shell">
      <header className="masthead">
        <div className="masthead-inner">
          <div>
            <p className="eyebrow">Catálogo de productos</p>
            <h1>Gestión de inventario</h1>
            <p className="lede">
              La fuente única de verdad para los artículos del negocio. Registra
              códigos únicos y consulta la información base antes de operar.
            </p>
          </div>
          <div className="masthead-meta">
            <span className="tag tag-green">Código único</span>
            <span className="tag tag-blue">Unidad de medida</span>
          </div>
        </div>
      </header>

      <main className="content-grid">
        <div className="column">
          <ProductForm onCreated={setSelectedProduct} />
          <ProductSearch onSelect={setSelectedProduct} />
        </div>
        <div className="column column-side">
          <ProductDetails product={selectedProduct} />
          <section className="note-panel" aria-label="Alcance del catálogo">
            <p className="eyebrow">Alcance</p>
            <p>
              El catálogo centraliza el registro y la consulta de productos. Las
              existencias y los movimientos se gestionan en los módulos de
              inventario.
            </p>
          </section>
        </div>
      </main>

      <footer className="footer">
        <span>Gestión de inventario</span>
        <span className="footer-divider" aria-hidden="true" />
        <span>Catálogo de Productos</span>
      </footer>
    </div>
  )
}
