import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { products } from '../data/products';

const Home = () => {
  return (
    <div style={{ backgroundColor: 'var(--theme-bg)', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Classic Hero Section */}
      <div className="hero-classic">
        <div className="hero-text">
          <h1>Premium Beverages<br/><span>Delivered Fresh.</span></h1>
          <p>
            Experience the authentic taste of your favorite soft drinks. 
            From the strong thunder of Thums Up to the clear refreshment of Sprite, 
            Murali Krishna Enterprises brings the best to your doorstep.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/catalog" className="btn-add" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
              Shop Catalog
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          {/* Main hero image bouncing/floating */}
          <img src="/images/thums_up_real.png" alt="Thums Up" className="hero-image-main" />
        </div>
      </div>

      {/* 10 Products Grid */}
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '10px' }}>Our Collection</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Explore our handpicked selection of refreshing beverages.</p>
        </div>

        <div className="products-classic-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card-classic">
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-img-classic" />
              </div>
              <div className="product-brand">{product.brand} • {product.category}</div>
              <h3 className="product-title">{product.name}</h3>
              <p className="product-desc">{product.description}</p>
              
              <div className="product-footer">
                <div className="product-price-tag">₹{product.price}</div>
                <button className="btn-add" onClick={() => {
                  const cart = JSON.parse(localStorage.getItem('cart_guest') || '[]');
                  const existing = cart.find(item => item.id === product.id);
                  if (existing) {
                    existing.quantity += 1;
                  } else {
                    cart.push({ ...product, quantity: 1 });
                  }
                  localStorage.setItem('cart_guest', JSON.stringify(cart));
                  alert(`${product.name} added to cart!`);
                  window.dispatchEvent(new Event('storage')); // Trigger update if possible
                }}>
                  <ShoppingCart size={18} /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
