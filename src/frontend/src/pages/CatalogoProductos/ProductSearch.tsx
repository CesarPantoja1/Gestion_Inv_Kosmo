import { FormEvent, useState } from 'react'
import {
  ApiError,
  Product,
  getProductByCode,
  searchProducts,
} from '../../api/client'

interface ProductSearchProps {
  onSelect: (product: Product) => void
}

export default function ProductSearch({ onSelect }: ProductSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const term = query.trim()
    setLoading(true)
    setError('')

    try {
      const [exactResult, nameResult] = await Promise.allSettled([
        term ? getProductByCode(term) : Promise.resolve(null),
        searchProducts(term),
      ])

      const items: Product[] = []
      if (exactResult.status === 'fulfilled' && exactResult.value) {
        items.push(exactResult.value)
      }
      if (nameResult.status === 'fulfilled') {
        for (const product of nameResult.value) {
          if (!items.some((item) => item.id === product.id)) {
            items.push(product)
          }
        }
      }

      if (exactResult.status === 'rejected' && nameResult.status === 'rejected') {
        throw nameResult.reason ?? exactResult.reason
      }

      setResults(items)
    } catch (searchError) {
      setResults([])
      setError(
        searchError instanceof ApiError
          ? searchError.message
          : 'No fue posible realizar la búsqueda.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel" aria-labelledby="product-search-title">
      <header className="panel-header">
        <p className="eyebrow">Consulta</p>
        <h2 id="product-search-title">Buscar producto</h2>
        <p className="panel-description">
          Localiza por código exacto o por coincidencia parcial en el nombre.
        </p>
      </header>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Código o nombre"
          aria-label="Código o nombre del producto"
          autoComplete="off"
        />
        <button type="submit" className="button-secondary" disabled={loading}>
          {loading ? 'Buscando…' : 'Buscar'}
        </button>
      </form>

      {error ? (
        <p className="feedback feedback-error" role="alert">
          {error}
        </p>
      ) : null}

      {results !== null && results.length === 0 && !error ? (
        <p className="empty-state">No se encontraron productos</p>
      ) : null}

      {results !== null && results.length > 0 ? (
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Nombre</th>
                <th scope="col">Unidad</th>
              </tr>
            </thead>
            <tbody>
              {results.map((product) => (
                <tr
                  key={product.id}
                  onClick={() => onSelect(product)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelect(product)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver detalles de ${product.name}`}
                >
                  <td className="mono">{product.code}</td>
                  <td>{product.name}</td>
                  <td>{product.unit_of_measure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {results === null ? (
        <p className="hint">
          Los resultados respetan el catálogo registrado en la base de datos.
        </p>
      ) : null}
    </section>
  )
}
