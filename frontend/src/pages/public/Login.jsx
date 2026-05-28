import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import request from '../../services/api.js';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await request('/auth/login', 'POST', { email, password });
      const { token, role } = response;
      login(token, role);
      navigate(`/${role}`);
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <span className="brand-icon">📚</span>
            <h1 className="brand-name">SFM System</h1>
          </div>
          <h2 className="login-title">Welcome Back!</h2>
          <p className="login-subtitle">
            Sign in to access your dashboard and manage your academic feedback.
          </p>
          <div className="login-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Submit course feedback</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>View analytics & reports</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Manage your courses</span>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <h3 className="card-title">Sign In</h3>
            
            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="login-footer">
              <Link to="/" className="back-link">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;