const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export interface Product {
  id: number
  code: string
  name: string
  unit_of_measure: string
}

export interface ProductCreate {
  code: string
  name: string
  unit_of_measure: string
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function extractDetail(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null
  const detail = (payload as { detail?: unknown }).detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) =>
        item && typeof item === 'object' && 'msg' in item
          ? String((item as { msg: unknown }).msg)
          : null,
      )
      .filter((value): value is string => Boolean(value))
    return messages.length > 0 ? messages.join('. ') : null
  }
  return null
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!response.ok) {
    let detail: string | null = null
    try {
      detail = extractDetail(await response.json())
    } catch {
      detail = null
    }
    throw new ApiError(
      response.status,
      detail ?? `Error ${response.status} al comunicarse con el servidor`,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function createProduct(data: ProductCreate): Promise<Product> {
  return apiRequest<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getProductByCode(code: string): Promise<Product> {
  return apiRequest<Product>(`/products/${encodeURIComponent(code)}`)
}

export function searchProducts(name: string): Promise<Product[]> {
  const query = name ? `?name=${encodeURIComponent(name)}` : ''
  return apiRequest<Product[]>(`/products${query}`)
}
