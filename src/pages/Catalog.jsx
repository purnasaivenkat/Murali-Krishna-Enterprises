import React from 'react';
import { products } from '../data/products';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Catalog = () => {
  const { user } = useAuth();

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem(`cart_${user?.id || 'guest'}`) || '[]');
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem(`cart_${user?.id || 'guest'}`, JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem' }}>Soft Drink <span>Inventory</span></h2>
        <p style={{ color: 'var(--text-muted)' }}>Explore our range of Thums Up, Sprite, Maaza, Limca, and Coca-Cola tins.</p>
      </header>

      <div className="product-grid">
        {products.map((product, index) => (
          <motion.div 
            key={product.id}
            className="product-card glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3 className="product-name">{product.name}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {product.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="product-price">₹{product.price}</span>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '0.5rem 1rem', borderRadius: '50px' }}
                  onClick={() => addToCart(product)}
                >
                  <Plus size={20} /> Add
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
