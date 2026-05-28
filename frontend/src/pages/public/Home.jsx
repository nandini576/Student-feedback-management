import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { token, role } = useContext(AuthContext);

  const getDashboardLink = () => {
    switch (role) {
      case 'admin': return '/admin';
      case 'faculty': return '/faculty';
      case 'student': return '/student';
      default: return '/login';
    }
  };

  const features = [
    {
      icon: '📝',
      title: 'Submit Feedback',
      description: 'Share your course experience easily and help improve academic quality.',
      link: token && role === 'student' ? '/student/feedback' : '/login',
      gradient: 'gradient-purple'
    },
    {
      icon: '📚',
      title: 'Browse Courses',
      description: 'Explore available courses offered across all semesters and departments.',
      link: '/courses',
      gradient: 'gradient-blue'
    },
    {
      icon: '📊',
      title: 'View Reports',
      description: 'Analyze feedback reports and track academic performance over time.',
      link: token ? getDashboardLink() : '/login',
      gradient: 'gradient-pink'
    },
    {
      icon: '👥',
      title: 'Manage Users',
      description: 'Admins can manage students, faculty, and user roles efficiently.',
      link: token && role === 'admin' ? '/admin/users' : '/login',
      gradient: 'gradient-green'
    }
  ];

  const stats = [
    { number: '500+', label: 'Students' },
    { number: '50+', label: 'Faculty' },
    { number: '100+', label: 'Courses' },
    { number: '1000+', label: 'Feedbacks' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>✨ Academic Excellence Platform</span>
          </div>

          <h1 className="hero-title">
            Student Feedback
            <span className="gradient-text"> Management</span>
            <br />System
          </h1>

          <p className="hero-subtitle slide-up">
            Empowering students, faculty, and administrators with seamless
            feedback collection, insightful analytics, and course management.
          </p>

          <div className="hero-buttons slide-up-delay">
            {token ? (
              <Link to={getDashboardLink()} className="hero-btn primary-btn">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="hero-btn primary-btn">
                  Get Started →
                </Link>
                <Link to="/courses" className="hero-btn secondary-btn">
                  Browse Courses
                </Link>
              </>
            )}
          </div>

          <div className="stats-row">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-illustration">
          <div className="illustration-card card-1">
            <span>🎓</span>
            <p>Student Portal</p>
          </div>
          <div className="illustration-card card-2">
            <span>👨‍🏫</span>
            <p>Faculty Dashboard</p>
          </div>
          <div className="illustration-card card-3">
            <span>🔒</span>
            <p>Admin Control</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Everything You Need</h2>
        <p className="section-subtitle">A complete academic feedback ecosystem for your institution</p>
        <div className="features-grid">
          {features.map((feature, i) => (
            <Link to={feature.link} key={i} className={`feature-card ${feature.gradient}`}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
              <span className="feature-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Role Info Section */}
      <section className="roles-section">
        <h2 className="section-title">Designed for Everyone</h2>
        <div className="roles-grid">
          <div className="role-card">
            <div className="role-icon">🎓</div>
            <h3>Students</h3>
            <ul>
              <li>Submit course feedback</li>
              <li>View enrolled courses</li>
              <li>Track feedback history</li>
            </ul>
            {!token && <Link to="/login" className="role-btn">Login as Student</Link>}
          </div>
          <div className="role-card role-center">
            <div className="role-icon">👨‍🏫</div>
            <h3>Faculty</h3>
            <ul>
              <li>View course feedback</li>
              <li>Access detailed reports</li>
              <li>Monitor student response</li>
            </ul>
            {!token && <Link to="/login" className="role-btn">Login as Faculty</Link>}
          </div>
          <div className="role-card">
            <div className="role-icon">🔒</div>
            <h3>Admin</h3>
            <ul>
              <li>Manage all users</li>
              <li>Oversee all courses</li>
              <li>Full analytics access</li>
            </ul>
            {!token && <Link to="/login" className="role-btn">Login as Admin</Link>}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2026 Student Feedback Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
