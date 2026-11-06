import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../app/store'
import { removeFromCart } from '../features/cart/cartSlice'
import { createOrder } from '../api'

const Cart: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalPrice = items.reduce((acc, item) => acc + item.price, 0)

  async function handleCheckout(event: React.FormEvent) {
    event.preventDefault()
    setStatus('')
    setIsSubmitting(true)
    try {
      const order = await createOrder({
        customerName,
        customerEmail,
        items: items.map((item) => ({ id: item.id, quantity: 1 })),
      })
      setStatus(`Order ${order.id.slice(0, 8)} placed successfully.`)
      setCustomerName('')
      setCustomerEmail('')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to place order.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <aside className="cart-panel" aria-labelledby="cart-title">
      <div className="cart-heading">
        <div>
          <p className="eyebrow">Your selection</p>
          <h2 id="cart-title">Shopping cart</h2>
        </div>
        <span className="cart-count">{items.length} items</span>
      </div>
      {items.length === 0 ? <p className="empty-cart">Your cart is empty. Add something you love.</p> : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt="" />
                <span>{item.name}</span>
                <strong>${item.price.toFixed(2)}</strong>
                <button onClick={() => dispatch(removeFromCart(item.id))} className="remove-button">Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-total"><span>Total</span><strong>${totalPrice.toFixed(2)}</strong></div>
          <form className="checkout-form" onSubmit={handleCheckout}>
            <label>Name<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required /></label>
            <label>Email<input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} required /></label>
            <button className="checkout-button" disabled={isSubmitting}>{isSubmitting ? 'Placing order...' : 'Place order'}</button>
            {status && <p className="checkout-status" role="status">{status}</p>}
          </form>
        </>
      )}
    </aside>
  )
}

export default Cart
