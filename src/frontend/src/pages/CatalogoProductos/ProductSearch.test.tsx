import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import ProductSearch from './ProductSearch'

const originalFetch = globalThis.fetch

const parlante = {
  id: 1,
  code: 'PAR-001',
  name: 'Parlante Bluetooth',
  unit_of_measure: 'unidad',
}

const auricular = {
  id: 2,
  code: 'AUR-001',
  name: 'Auriculares',
  unit_of_measure: 'unidad',
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

function stubFetch(handler: (url: string) => Response) {
  globalThis.fetch = (async (input: RequestInfo | URL) =>
    handler(String(input))) as typeof fetch
}

afterEach(() => {
  cleanup()
  globalThis.fetch = originalFetch
})

describe('ProductSearch', () => {
  it('shows products matched by code and by partial name', async () => {
    stubFetch((url) => {
      if (url.includes('/products/')) return jsonResponse(parlante)
      return jsonResponse([parlante, auricular])
    })

    const selected: string[] = []
    render(<ProductSearch onSelect={(product) => selected.push(product.code)} />)

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'PAR-001' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(await screen.findByText('PAR-001')).toBeTruthy()
    expect(screen.getByText('Auriculares')).toBeTruthy()
    expect(screen.getAllByText('PAR-001')).toHaveLength(1)
  })

  it('shows an empty state when no products match', async () => {
    stubFetch((url) => {
      if (url.includes('/products/')) {
        return jsonResponse({ detail: 'Producto no encontrado' }, 404)
      }
      return jsonResponse([])
    })

    render(<ProductSearch onSelect={() => undefined} />)

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'inexistente' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(await screen.findByText('No se encontraron productos')).toBeTruthy()
  })
})
