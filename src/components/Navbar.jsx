import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Droplet, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Calculate total cart items (simulated from localStorage for guest/user)
  const cartData = JSON.parse(localStorage.getItem(`cart_${user?.id || 'guest'}`) || '[]');
  const cartCount = cartData.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar-classic">
      <Link to="/" className="logo-classic">
        <Droplet size={32} color="var(--accent)" />
        Murali Krishna <span>Enterprises</span>
      </Link>
      
      <div className="nav-links-classic hide-mobile">
        <Link to="/" className="nav-link-item">Home</Link>
        <Link to="/catalog" className="nav-link-item">Our Products</Link>
      </div>

      <div className="nav-actions">
        <form className="search-classic hide-mobile" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit"><Search size={18} /></button>
        </form>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link-item hide-mobile">
              <User size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} /> 
              {user.user_metadata?.full_name?.split(' ')[0]}
            </Link>
            <button onClick={handleLogout} className="nav-link-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link-item">Login / Sign Up</Link>
        )}
        
        <Link to="/cart" className="cart-classic">
          <ShoppingCart size={28} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          <span className="hide-mobile" style={{ marginLeft: '5px' }}>Cart</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
