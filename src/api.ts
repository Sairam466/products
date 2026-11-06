export interface ProductRecord {
  id: string
  name: string
  description: string
  price_cents: number
  image_url: string
  category: string
  stock: number
}

const API_URL = import.meta.env.VITE_API_URL || ''

export async function fetchProducts(): Promise<ProductRecord[]> {
  const response = await fetch(`${API_URL}/api/products`)
  if (!response.ok) throw new Error('Unable to load products')
  return response.json()
}

export async function createOrder(input: {
  customerName: string
  customerEmail: string
  items: Array<{ id: string; quantity: number }>
}) {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || 'Unable to create order')
  return body.order
}
