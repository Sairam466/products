import React from 'react'
import useSWR from 'swr'
import './App.css'
import { fetchProducts } from './api'
import Product from './components/Product'
import Cart from './components/Cart'

const App: React.FC = () => {
  const { data: products, error, isLoading } = useSWR('products', fetchProducts)

  return (
    <main className="app-container">
      <header className="store-header">
        <p className="eyebrow">Curated essentials</p>
        <h1>E-Commerce Store</h1>
        <p className="store-subtitle">Simple products, thoughtfully selected.</p>
      </header>
      <section className="product-grid" aria-label="Products">
        {isLoading && <p className="status-message">Loading products...</p>}
        {error && <p className="status-message error">We could not load the catalog. Please try again.</p>}
        {products?.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </section>
      <Cart />
    </main>
  )
}

export default App
