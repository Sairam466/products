import cors from 'cors'
import express from 'express'
import pg from 'pg'

const { Pool } = pg
const app = express()
const port = Number(process.env.API_PORT || 8787)
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

app.use(cors({ origin: true }))
app.use(express.json({ limit: '1mb' }))

const seedProducts = [
  ['T-Shirt', 'Soft everyday cotton tee.', 20, 'https://nobero.com/cdn/shop/files/poppyred_7354057a-1c7e-413f-90b1-6bd0a4bc7d7e.jpg?v=1743070745', 'Apparel', 25],
  ['Shoes', 'Comfortable sneakers for every day.', 50, 'https://images.meesho.com/images/products/370528537/mczok_1200.jpg', 'Footwear', 12],
  ['Watch', 'A clean, classic everyday watch.', 35, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRMwUi28MVaUT5bpS66phUQ9v7M_C6tvJ6YnnfOVtH_kgrhRtH6zPxJ_Kn2xz4UxaZCPsogm40xnjILNbcStl3x6uYntumy4Bhws252E1qmY1YxdDehIUTeAQ', 'Accessories', 8],
  ['Headphones', 'Immersive sound with a comfortable fit.', 80, 'https://www.headphonezone.in/cdn/shop/files/Headphone-Zone-CCA-Hydro-Silver-Plated-Cable-With-Mic-Gallery-Image-03-New.jpg?v=1719922433&width=2048', 'Electronics', 10],
]

async function ensureCatalog() {
  const existing = await pool.query('SELECT COUNT(*)::int AS count FROM products')
  if (existing.rows[0].count > 0) return
  for (const [name, description, price, imageUrl, category, stock] of seedProducts) {
    await pool.query(`INSERT INTO products (name, description, price_cents, image_url, category, stock)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING`, [name, description, price * 100, imageUrl, category, stock])
  }
}

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.get('/api/products', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT DISTINCT ON (name) id, name, description, price_cents, image_url, category, stock FROM products ORDER BY name, created_at ASC')
    res.json(rows)
  } catch (error) {
    console.error('[v0] Failed to fetch products:', error)
    res.status(500).json({ error: 'Unable to load products' })
  }
})

app.post('/api/orders', async (req, res) => {
  const { customerName, customerEmail, items } = req.body
  if (!customerName?.trim() || !/^\S+@\S+\.\S+$/.test(customerEmail || '') || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Name, valid email, and at least one item are required' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const productIds = items.map((item) => item.id)
    const { rows: products } = await client.query('SELECT id, name, price_cents, stock FROM products WHERE id = ANY($1::uuid[]) FOR UPDATE', [productIds])
    const byId = new Map(products.map((product) => [product.id, product]))
    let totalCents = 0
    const normalizedItems = items.map((item) => {
      const product = byId.get(item.id)
      const quantity = Number(item.quantity)
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) throw new Error('One or more items are unavailable')
      totalCents += product.price_cents * quantity
      return { product, quantity }
    })

    const orderResult = await client.query('INSERT INTO orders (customer_name, customer_email, total_cents) VALUES ($1, $2, $3) RETURNING id, status, total_cents, created_at', [customerName.trim(), customerEmail.trim().toLowerCase(), totalCents])
    const order = orderResult.rows[0]
    for (const { product, quantity } of normalizedItems) {
      await client.query('INSERT INTO order_items (order_id, product_id, product_name, unit_price_cents, quantity) VALUES ($1, $2, $3, $4, $5)', [order.id, product.id, product.name, product.price_cents, quantity])
      await client.query('UPDATE products SET stock = stock - $1, updated_at = now() WHERE id = $2', [quantity, product.id])
    }
    await client.query('COMMIT')
    res.status(201).json({ order })
  } catch (error) {
    await client.query('ROLLBACK')
    res.status(400).json({ error: error.message || 'Unable to create order' })
  } finally {
    client.release()
  }
})

ensureCatalog().then(() => app.listen(port, () => console.log(`[v0] API listening on ${port}`))).catch((error) => {
  console.error('[v0] API startup failed:', error)
  process.exit(1)
})
