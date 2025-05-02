import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { removeFromCart } from '../features/cart/cartSlice';

const Cart: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const totalItems = items.length;
  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="border p-4 rounded mt-4 bg-gray-100 shadow">
      <h2 className="text-xl font-bold mb-2">🛒 Cart</h2>
      <p className="text-gray-700 mb-2">
        <strong>Total Items:</strong> {totalItems} <br />
        <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
      </p>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center py-2 border-t">
          <span>{item.name} - ${item.price}</span>
          <button
            onClick={() => dispatch(removeFromCart(item.id))}
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
