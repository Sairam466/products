import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';

interface Props {
  id: number;
  name: string;
  price: number;
  image: string;
}

const Product: React.FC<Props> = ({ id, name, price ,image}) => {
  const dispatch = useDispatch();

  return (
    <div className="product-card">
      <img src={image} alt={name} className="w-full h-40 object-cover rounded mb-2" />
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-gray-700">${price}</p>
      <button
        onClick={() => dispatch(addToCart({ id, name, price ,image}))}
        className="product-button"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
