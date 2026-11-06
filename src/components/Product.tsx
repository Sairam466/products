import React from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'
import type { ProductRecord } from '../api'

interface Props {
  product: ProductRecord
}

const Product: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch()
  const price = product.price_cents / 100

  return (
    <article className="product-card">
      <img src={product.image_url} alt={product.name} className="product-image" />
      <div className="product-details">
        <p className="product-category">{product.category}</p>
        <h2>{product.name}</h2>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <strong>${price.toFixed(2)}</strong>
          <button
            onClick={() => dispatch(addToCart({ id: product.id, name: product.name, price, image: product.image_url }))}
            className="product-button"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Sold out' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default Product
