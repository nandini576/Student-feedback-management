import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import request from '../../services/api.js';
import { AuthContext } from '../../context/AuthContext';
import './FacultyPages.css';

const FacultyDashboard = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalFeedback: 0,
    avgRating: 0,
  });
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, feedbackRes] = await Promise.all([
        request('/courses/my-courses'),
        request('/feedback/my-feedback'),
      ]);

      const courses = coursesRes.courses || [];
      const feedback = feedbackRes.feedback || [];

      let totalRating = 0;
      let ratingCount = 0;
      feedback.forEach(fb => {
        fb.responses?.forEach(r => {
          if (typeof r.answer === 'number') {
            totalRating += r.answer;
            ratingCount++;
          }
        });
      });

      setStats({
        totalCourses: courses.length,
        totalFeedback: feedback.length,
        avgRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 'N/A',
      });

      setRecentFeedback(feedback.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: '📚', label: 'My Courses', value: stats.totalCourses, color: 'blue' },
    { icon: '📝', label: 'Feedback Received', value: stats.totalFeedback, color: 'purple' },
    { icon: '⭐', label: 'Avg Rating', value: stats.avgRating, color: 'pink' },
  ];

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="faculty-dashboard">
      <div className="page-header">
        <h1 className="page-title">Faculty Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's your overview.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Recent Feedback</h3>
            <Link to="/faculty/feedback" className="btn btn-secondary">View All</Link>
          </div>
          {recentFeedback.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h4 className="empty-title">No feedback yet</h4>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Student</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentFeedback.map((fb, i) => (
                  <tr key={i}>
                    <td>{fb.courseId?.courseName || 'Unknown'}</td>
                    <td>{fb.studentId?.name || 'Unknown'}</td>
                    <td>{new Date(fb.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/faculty/courses" className="action-card">
              <span className="action-icon">📚</span>
              <span className="action-text">View My Courses</span>
            </Link>
            <Link to="/faculty/reports" className="action-card">
              <span className="action-icon">📊</span>
              <span className="action-text">View Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
