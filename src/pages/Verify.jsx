import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import { motion } from 'framer-motion';

const Verify = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { error } = await insforge.auth.verifyEmail({
        email,
        otp: otp
      });
      
      if (error) throw error;
      
      alert('Email verified successfully! You can now login.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card glass"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Verify Email</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Please enter the verification code sent to your email.
        </p>
        
        {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        
        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Verification Code (OTP)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter 6-digit code"
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Verify;
