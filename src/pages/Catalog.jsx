import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Catalog = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const searchNormalized = normalize(searchQuery);

  const filteredProducts = products.filter(p => {
    const searchString = normalize(`${p.name} ${p.brand} ${p.category} ${p.description} mazza thumsup`); // adding common misspellings directly to searchable text just in case, but normalize handles thumsup
    
    const matchesSearch = !searchNormalized || searchString.includes(searchNormalized) || 
                          (searchNormalized === 'mazza' && normalize(p.name).includes('maaza')) ||
                          (searchNormalized === 'thumsup' && normalize(p.name).includes('thumsup'));
                          
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

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
    <div className="container" style={{ padding: '40px 20px', minHeight: '100vh' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>Complete <span>Collection</span></h2>
        <p style={{ color: 'var(--text-muted)' }}>Explore our 10 refreshing products, from Thums Up to Minute Maid.</p>
      </header>

      <div className="products-classic-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              className="product-card-classic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-img-classic" />
              </div>
            <div className="product-brand">{product.brand} • {product.category}</div>
            <h3 className="product-title">{product.name}</h3>
            <p className="product-desc">{product.description}</p>
            
            <div className="product-footer">
              <div className="product-price-tag">₹{product.price}</div>
              <button 
                className="btn-add" 
                onClick={() => addToCart(product)}
              >
                <ShoppingCart size={18} /> Add
              </button>
            </div>
          </motion.div>
          ))
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>No products found matching "{searchQuery}"</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
