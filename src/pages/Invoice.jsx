import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Printer, Beer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Invoice = () => {
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem('last_order'));

  if (!order) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>No recent order found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/catalog')}>Back to Catalog</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // Recalculate for display if needed, but we should use values from order object
  const subtotalBeforeDiscount = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalDiscount = order.discount || 0;
  const subtotal = subtotalBeforeDiscount - totalDiscount;
  const gst = parseFloat((subtotal * 0.05).toFixed(2));
  const finalTotal = subtotal + gst;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <CheckCircle size={60} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2.5rem' }}>Booking <span>Confirmed!</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Thank you for choosing Murali Krishna Enterprises.</p>
        </div>

        <motion.div 
          className="glass" 
          style={{ padding: '3rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', borderBottom: '2px solid var(--border)', paddingBottom: '2rem' }}>
            <div>
              <div className="logo" style={{ fontSize: '1.8rem' }}>
                <Beer size={32} />
                Murali Krishna <span>Enterprises</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Premium Soft Drink Distributors<br />
                Coca-Cola & Pepsi Authorized Partner
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ margin: 0 }}>INVOICE</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Order ID: {order.id.slice(-8).toUpperCase()}<br />
                Date: {new Date(order.date).toLocaleDateString()}<br />
                Time: {new Date(order.date).toLocaleTimeString()}<br />
                Status: <span style={{ color: 'var(--success)', fontWeight: '700' }}>PAID</span>
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Order Items</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ textAlign: 'left', padding: '1rem 0' }}>Description</th>
                  <th style={{ textAlign: 'center', padding: '1rem 0' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '1rem 0' }}>Unit Price</th>
                  <th style={{ textAlign: 'right', padding: '1rem 0' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--theme-bg)', borderRadius: '6px', padding: '4px', border: '1px solid var(--border)' }}>
                        <img 
                          src={item.image || '/images/thums_up_real.png'} 
                          alt={item.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => { e.target.onerror = null; e.target.src = '/images/thums_up_real.png'; }}
                        />
                      </div>
                      <div>
                        <span style={{ fontWeight: '600' }}>{item.name}</span><br />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', padding: '1rem 0' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', padding: '1rem 0' }}>₹{item.price}</td>
                    <td style={{ textAlign: 'right', padding: '1rem 0' }}>₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '280px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>₹{subtotalBeforeDiscount}</span>
              </div>
              {totalDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--success)' }}>
                  <span>Bulk Discount (₹1/unit)</span>
                  <span>-₹{totalDiscount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
                <span>₹{gst}</span>
              </div>
              <div style={{ height: '2px', background: 'var(--primary)', margin: '1rem 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '800' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '4rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border)', paddingTop: '2rem' }}>
            <p>This is a computer-generated invoice. No signature is required.</p>
            <p style={{ fontWeight: '600', color: 'var(--primary)', marginTop: '0.5rem' }}>Refreshment Guaranteed by Murali Krishna Enterprises</p>
          </div>
        </motion.div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={20} /> Print Bill
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            View Dashboard
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          .navbar, .btn, .no-print { display: none !important; }
          .container { padding: 0 !important; }
          .glass { border: none !important; box-shadow: none !important; background: white !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default Invoice;
