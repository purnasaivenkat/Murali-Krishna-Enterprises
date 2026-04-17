import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, CreditCard, ChevronRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { user, addOrder } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem(`cart_${user?.id || 'guest'}`) || '[]');
    setCartItems(savedCart);
  }, [user]);

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem(`cart_${user?.id || 'guest'}`, JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem(`cart_${user?.id || 'guest'}`, JSON.stringify(updated));
  };

  const calculateItemTotal = (item) => {
    const price = item.quantity > 6 ? item.price - 1 : item.price;
    return price * item.quantity;
  };

  const subtotalBeforeDiscount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalDiscount = cartItems.reduce((acc, item) => item.quantity > 6 ? acc + item.quantity : acc, 0);
  const subtotal = subtotalBeforeDiscount - totalDiscount;
  const gst = parseFloat((subtotal * 0.05).toFixed(2));
  const finalTotal = subtotal + gst;

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to complete your booking.');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    navigate('/payment', { 
      state: { 
        total: finalTotal,
        items: cartItems,
        discount: totalDiscount
      } 
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <ShoppingBag size={80} color="var(--border)" style={{ marginBottom: '2rem' }} />
        <h2>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Add some delicious drinks to get started!</p>
        <button className="btn btn-primary" onClick={() => navigate('/catalog')}>Go to Catalog</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h2 style={{ marginBottom: '2rem' }}>Shopping <span>Cart</span></h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map(item => (
            <div key={item.id} className="glass" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', gap: '1.5rem', alignItems: 'center', position: 'relative' }}>
              <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ margin: 0 }}>{item.name}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{item.category}</p>
                {item.quantity > 6 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <Tag size={12} /> Bulk Discount Applied (₹1 off per bottle)
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
              <div style={{ width: '100px', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem' }}>
                ₹{calculateItemTotal(item)}
                {item.quantity > 6 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{item.price * item.quantity}</div>
                )}
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0.5rem' }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <aside>
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>₹{subtotalBeforeDiscount}</span>
            </div>
            {totalDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--success)' }}>
                <span>Bulk Discount</span>
                <span>-₹{totalDiscount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
              <span>₹{gst}</span>
            </div>
            <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: '700' }}>
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={handleCheckout} disabled={loading}>
              {loading ? 'Processing...' : 'Checkout'} <ChevronRight size={20} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
