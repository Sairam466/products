import React from 'react';
import './App.css';
import Product from './components/Product';
import Cart from './components/Cart';

const App: React.FC = () => {
  return (
    <main className="app-container">
      <header className="store-header">
        <p className="eyebrow">Curated essentials</p>
        <h1>E-Commerce Store</h1>
        <p className="store-subtitle">Simple products, thoughtfully selected.</p>
      </header>
      <section className="product-grid" aria-label="Products">
        <Product id={1} name="T-Shirt" price={20}  image="https://nobero.com/cdn/shop/files/poppyred_7354057a-1c7e-413f-90b1-6bd0a4bc7d7e.jpg?v=1743070745"  />
        <Product id={2} name="Shoes" price={50}  image="https://images.meesho.com/images/products/370528537/mczok_1200.jpg" />
        <Product id={3} name="watch" price={35} image="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRMwUi28MVaUT5bpS66phUQ9v7M_C6tvJ6YnnfOVtH_kgrhRtH6zPxJ_Kn2xz4UxaZCPsogm40xnjILNbcStl3x6uYntumy4Bhws252E1qmY1YxdDehIUTeAQ"   />
        <Product id={4} name="Headphones" price={80}image="https://www.headphonezone.in/cdn/shop/files/Headphone-Zone-CCA-Hydro-Silver-Plated-Cable-With-Mic-Gallery-Image-03-New.jpg?v=1719922433&width=2048" />
      </section>
      <Cart />
    </main>
  );
};

export default App;




