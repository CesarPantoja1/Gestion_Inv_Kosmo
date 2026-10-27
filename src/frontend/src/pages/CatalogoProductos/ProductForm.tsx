import { FormEvent, useState } from 'react'
import { ApiError, Product, createProduct } from '../../api/client'

interface ProductFormProps {
  onCreated?: (product: Product) => void
}

const EMPTY_FORM = {
  code: '',
  name: '',
  unit_of_measure: '',
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ProductForm({ onCreated }: ProductFormProps) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const product = await createProduct({
        code: form.code.trim(),
        name: form.name.trim(),
        unit_of_measure: form.unit_of_measure.trim(),
      })
      setForm(EMPTY_FORM)
      setStatus('success')
      setMessage(`Producto ${product.code} registrado correctamente.`)
      onCreated?.(product)
    } catch (error) {
      setStatus('error')
      if (error instanceof ApiError && error.status === 409) {
        setMessage('Código de producto duplicado')
      } else if (error instanceof ApiError) {
        setMessage(error.message)
      } else {
        setMessage('No fue posible registrar el producto.')
      }
    }
  }

  return (
    <section className="panel" aria-labelledby="product-form-title">
      <header className="panel-header">
        <p className="eyebrow">Registro</p>
        <h2 id="product-form-title">Nuevo producto</h2>
        <p className="panel-description">
          Incorpora un artículo al catálogo con su código único, nombre y unidad
          de medida.
        </p>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Código</span>
          <input
            type="text"
            value={form.code}
            onChange={(event) => updateField('code', event.target.value)}
            maxLength={50}
            required
            autoComplete="off"
            placeholder="PAR-001"
          />
        </label>

        <label className="field">
          <span>Nombre</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            maxLength={255}
            required
            autoComplete="off"
            placeholder="Parlante Bluetooth"
          />
        </label>

        <label className="field">
          <span>Unidad de medida</span>
          <input
            type="text"
            value={form.unit_of_measure}
            onChange={(event) =>
              updateField('unit_of_measure', event.target.value)
            }
            maxLength={20}
            required
            autoComplete="off"
            placeholder="unidad"
          />
        </label>

        <button
          type="submit"
          className="button-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Registrando…' : 'Registrar producto'}
        </button>

        {message ? (
          <p
            className={`feedback ${status === 'error' ? 'feedback-error' : 'feedback-success'}`}
            role={status === 'error' ? 'alert' : 'status'}
          >
            {message}
          </p>
        ) : null}
      </form>
    </section>
  )
}
