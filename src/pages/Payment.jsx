import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Lock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addOrder } = useAuth();
  const { total, items, discount } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('card');
  const [success, setSuccess] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const orderData = {
        total,
        items,
        discount,
        payment_status: 'paid'
      };
      
      const newOrder = await addOrder(orderData);
      
      // Store last order for invoice
      localStorage.setItem('last_order', JSON.stringify({
        ...newOrder,
        date: newOrder.created_at,
        enterprise: 'Murali Krishna Enterprises',
        discount
      }));
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/invoice');
      }, 1500);
    } catch (err) {
      alert('Payment successful but order creation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!total) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Invalid Payment Session</h2>
        <button className="btn btn-primary" onClick={() => navigate('/catalog')}>Back to Catalog</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Secure <span>Checkout</span></h2>
        
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          {/* Ordered Items Summary */}
          <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items && items.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'var(--theme-bg)', borderRadius: '12px' }}>
                <div style={{ width: '50px', height: '50px', flexShrink: 0, backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', padding: '4px', border: '1px solid var(--border)' }}>
                  <img 
                    src={item.image || '/images/thums_up_real.png'} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/thums_up_real.png'; }}
                  />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h5 style={{ margin: 0, fontSize: '0.95rem' }}>{item.name}</h5>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} x ₹{item.price}
                  </div>
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', padding: '1.5rem', background: 'var(--theme-bg)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <span style={{ fontWeight: '600', fontSize: '1.2rem' }}>Order Total</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
          </div>

          <form onSubmit={handlePayment}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', fontSize: '0.9rem' }}>Payment Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div 
                  className={`glass ${method === 'card' ? 'active' : ''}`}
                  onClick={() => setMethod('card')}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    border: method === 'card' ? '2px solid var(--primary)' : '1px solid var(--border)'
                  }}
                >
                  <CreditCard size={20} /> Card
                </div>
                <div 
                  className={`glass ${method === 'upi' ? 'active' : ''}`}
                  onClick={() => setMethod('upi')}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    border: method === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border)'
                  }}
                >
                  <span style={{ fontWeight: '800' }}>UPI</span> PhonePe/GPay
                </div>
              </div>
            </div>

            {method === 'card' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div className="form-group">
                  <label>Card Number</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="glass" style={{ width: '100%', paddingLeft: '3rem' }} required />
                    <CreditCard size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input type="text" placeholder="12/28" className="glass" style={{ width: '100%' }} required />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="password" placeholder="***" className="glass" style={{ width: '100%' }} required />
                  </div>
                </div>
              </motion.div>
            )}

            {method === 'upi' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div className="form-group">
                  <label>UPI ID</label>
                  <input type="text" placeholder="username@okaxis" className="glass" style={{ width: '100%' }} required />
                </div>
              </motion.div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', fontSize: '1.1rem' }} disabled={loading || success}>
              {loading ? 'Processing Payment...' : success ? 'Payment Successful!' : `Pay ₹${total.toFixed(2)}`}
              {!loading && !success && <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />}
              {success && <CheckCircle2 size={20} style={{ marginLeft: '0.5rem' }} />}
            </button>
          </form>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={14} /> 256-bit SSL</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={14} /> PCI-DSS Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
