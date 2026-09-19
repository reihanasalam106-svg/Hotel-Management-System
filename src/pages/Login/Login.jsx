import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Crown, Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@hotelpro.com');
  const [password, setPassword] = useState('Admin@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  const handleSubmit = async (e) => {
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
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const message = err.message || 'Invalid email or password. Please try again.';
      setToastMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetRoleCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrors({});
    setToastMsg('');
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />

          <div className="login-options-row">
            <label className="remember-me-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="forgot-password-link" onClick={(e) => { e.preventDefault(); alert('Please contact the hotel administrator to reset your password.'); }}>
              Forgot password?
            </a>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth icon={isSubmitting ? Loader2 : ShieldCheck} disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </Button>
        </form>

        <div className="login-demo-notice">
          <p className="notice-title">Quick Demo Logins (Click to Populate)</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', marginTop: '6px' }}>
            <button type="button" onClick={() => handleSetRoleCredentials('admin@hotelpro.com', 'Admin@123')} style={{ background: 'none', border: 'none', color: '#d4af37', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
              👑 <strong>Admin</strong>: admin@hotelpro.com (Admin@123)
            </button>
            <button type="button" onClick={() => handleSetRoleCredentials('manager@hotelpro.com', 'Manager@123')} style={{ background: 'none', border: 'none', color: '#93c5fd', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
              👔 <strong>Manager</strong>: manager@hotelpro.com (Manager@123)
            </button>
            <button type="button" onClick={() => handleSetRoleCredentials('receptionist@hotelpro.com', 'Reception@123')} style={{ background: 'none', border: 'none', color: '#86efac', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
              🏨 <strong>Receptionist</strong>: receptionist@hotelpro.com (Reception@123)
            </button>
            <button type="button" onClick={() => handleSetRoleCredentials('housekeeping@hotelpro.com', 'House@123')} style={{ background: 'none', border: 'none', color: '#fcd34d', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
              🧹 <strong>Housekeeping</strong>: housekeeping@hotelpro.com (House@123)
            </button>
            <button type="button" onClick={() => handleSetRoleCredentials('staff@hotelpro.com', 'Staff@123')} style={{ background: 'none', border: 'none', color: '#cbd5e1', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
              👤 <strong>Staff</strong>: staff@hotelpro.com (Staff@123)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
