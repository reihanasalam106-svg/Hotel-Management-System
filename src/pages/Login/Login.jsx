import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@hotelpro.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToastMsg('Please fix the validation errors before logging in.');
      return;
    }

    setErrors({});
    setToastMsg('');
    // Successful frontend authentication simulation
    navigate('/dashboard');
  };

  return (
    <div className="login-page-container">
      <div className="login-card-wrapper">
        <div className="login-brand-header">
          <div className="login-logo-badge">
            <Crown size={28} />
          </div>
          <h1 className="login-brand-title">HOTEL MANAGEMENT</h1>
          <span className="login-brand-subtitle">HotelPro Console Login</span>
        </div>

        {toastMsg && (
          <div className="login-toast-wrapper">
            <Toast message={toastMsg} type="error" onClose={() => setToastMsg('')} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@hotelpro.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            error={errors.password}
            required
          />

          <div className="login-options-row">
            <label className="remember-me-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="forgot-password-link" onClick={(e) => { e.preventDefault(); alert('Password reset flow simulated in Phase 1.'); }}>
              Forgot password?
            </a>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth icon={ShieldCheck}>
            Sign In to Dashboard
          </Button>
        </form>

        <div className="login-demo-notice">
          <p className="notice-title">Demo Credentials</p>
          <p className="notice-credentials">Email: <code>admin@hotelpro.com</code> | Password: <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
};
