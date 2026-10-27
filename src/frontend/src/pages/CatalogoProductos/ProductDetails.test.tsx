import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProductDetails from './ProductDetails'

describe('ProductDetails', () => {
  it('shows the product code, name and unit of measure', () => {
    render(
      <ProductDetails
        product={{
          id: 1,
          code: 'PAR-001',
          name: 'Parlante Bluetooth',
          unit_of_measure: 'unidad',
        }}
      />,
    )

    expect(screen.getByText('PAR-001')).toBeTruthy()
    expect(screen.getByText('Parlante Bluetooth')).toBeTruthy()
    expect(screen.getByText('unidad')).toBeTruthy()
  })

  it('shows a placeholder when there is no selected product', () => {
    render(<ProductDetails product={null} />)

    expect(screen.getByText('Seleccione un producto')).toBeTruthy()
  })
})
