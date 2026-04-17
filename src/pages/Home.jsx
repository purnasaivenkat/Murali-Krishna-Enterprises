import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Beer, ShieldCheck, ShoppingBag, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="container">
      <header style={{ padding: '80px 0', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: '4rem', fontWeight: '900', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Murali Krishna Enterprises
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Your premium destination for authentic soft drinks including Thums Up, Sprite, Maaza, Limca, and Coca-Cola tins. Refreshment, delivered with excellence.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/catalog" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Explore Catalog <ShoppingBag size={20} />
            </Link>
            <Link to="/signup" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Join Now <Zap size={20} />
            </Link>
          </div>
        </motion.div>
      </header>

      <section style={{ padding: '60px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <ShieldCheck size={40} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <h3>Secure Platform</h3>
          <p>Advanced authentication to keep your business data and orders safe and private.</p>
        </div>
        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <Beer size={40} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <h3>Market Favorites</h3>
          <p>Access the complete range of Thums Up, Sprite, Maaza, and Coca-Cola varieties in convenient tins.</p>
        </div>
        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <ShoppingBag size={40} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <h3>Custom Inventory</h3>
          <p>Add and manage your own unique soft drink items alongside market varieties.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
