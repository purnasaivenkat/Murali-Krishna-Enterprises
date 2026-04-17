import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Beer } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <Link to="/" className="logo">
        <Beer size={32} />
        Murali Krishna <span>Enterprises</span>
      </Link>
      
      <div className="nav-links">
        <Link to="/catalog" className="nav-link">Catalog</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">My Drinks</Link>
            <Link to="/cart" className="nav-link">
              <ShoppingCart size={20} />
            </Link>
            <Link to="/dashboard" className="nav-link">
              <User size={20} /> {user.user_metadata?.full_name?.split(' ')[0]}
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
