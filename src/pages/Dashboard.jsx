import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, Trash2, Package, History } from 'lucide-react';

const Dashboard = () => {
  const { user, customDrinks, orders, addCustomDrink, removeCustomDrink } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDrink, setNewDrink] = useState({ name: '', price: '', category: 'Custom' });
  const [loading, setLoading] = useState(false);

  const handleAddDrink = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCustomDrink({
        ...newDrink,
        price: parseFloat(newDrink.price),
        image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&q=80&w=400'
      });
      setNewDrink({ name: '', price: '', category: 'Custom' });
      setShowAddForm(false);
    } catch (err) {
      alert('Error adding drink: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDrink = async (id) => {
    try {
      await removeCustomDrink(id);
    } catch (err) {
      alert('Error removing drink: ' + err.message);
    }
  };

  if (!user) return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Please login to view dashboard.</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem' }}>Welcome, <span>{user.user_metadata?.full_name || user.email}</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your custom inventory and view order history on Insforge Backend.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={20} /> Add Custom Drink
        </button>
      </header>

      {showAddForm && (
        <motion.div 
          className="glass" 
          style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <h3>Add New Product</h3>
          <form onSubmit={handleAddDrink} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Drink Name</label>
              <input 
                className="form-input" 
                value={newDrink.name} 
                onChange={e => setNewDrink({...newDrink, name: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input 
                type="number" 
                className="form-input" 
                value={newDrink.price} 
                onChange={e => setNewDrink({...newDrink, price: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input 
                className="form-input" 
                value={newDrink.category} 
                onChange={e => setNewDrink({...newDrink, category: e.target.value})} 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1.25rem' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <section>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={24} color="var(--accent)" /> Your Custom Drinks (Stored on Insforge)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {customDrinks.length > 0 ? (
              customDrinks.map(drink => (
                <div key={drink.id} className="glass" style={{ padding: '1rem 1.5rem', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{drink.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 'bold' }}>{drink.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>₹{drink.price}</span>
                    <button 
                      onClick={() => handleRemoveDrink(drink.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No custom drinks added yet.</p>
            )}
          </div>
        </section>

        <section>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={24} color="var(--accent)" /> Recent Orders
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600' }}>Order #{order.id.slice(-6)}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Detailed Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                    {order.items && order.items.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', flexShrink: 0, backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', padding: '5px', border: '1px solid var(--border)' }}>
                          <img 
                            src={item.image || '/images/thums_up_real.png'} 
                            alt={item.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.target.onerror = null; e.target.src = '/images/thums_up_real.png'; }}
                          />
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <h5 style={{ margin: 0, fontSize: '1rem' }}>{item.name}</h5>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {item.brand} • {item.category}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Qty: {item.quantity} x ₹{item.price}
                          </div>
                        </div>
                        <div style={{ fontWeight: '700' }}>
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{order.items?.length || 0} items</span>
                    <span style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary)' }}>Total: ₹{order.total}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No orders placed yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
