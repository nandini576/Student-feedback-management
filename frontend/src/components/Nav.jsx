import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Nav.css';

const Nav = () => {
  const { token, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'faculty':
        return '/faculty';
      case 'student':
        return '/student';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">SFM System</span>
        </Link>
      </div>

      <div className="nav-links">
        {/* Public Links - Always visible */}
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/courses" className="nav-link">Get Courses</Link>

        {/* Role-based Links */}
        {token && role === 'student' && (
          <>
            <Link to="/student/feedback" className="nav-link highlight">Submit Feedback</Link>
            <Link to="/student/courses" className="nav-link">My Courses</Link>
          </>
        )}

        {token && role === 'faculty' && (
          <>
            <Link to="/faculty/courses" className="nav-link">My Courses</Link>
            <Link to="/faculty/feedback" className="nav-link">View Feedback</Link>
            <Link to="/faculty/reports" className="nav-link">Reports</Link>
          </>
        )}

        {token && role === 'admin' && (
          <>
            <Link to="/admin/users" className="nav-link">Manage Users</Link>
            <Link to="/admin/courses" className="nav-link">Manage Courses</Link>
            <Link to="/admin/reports" className="nav-link">Reports</Link>
          </>
        )}
      </div>

      <div className="nav-auth">
        {token ? (
          <div className="user-section">
            <Link to={getDashboardLink()} className="dashboard-btn">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
