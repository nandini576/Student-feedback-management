import { useState, useEffect } from 'react';
import request from '../../services/api.js';
import './AdminPages.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    totalFeedback: 0,
  });
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, coursesRes, feedbackRes] = await Promise.all([
        request('/users'),
        request('/courses'),
        request('/feedback'),
      ]);

      const users = usersRes.users || [];
      const courses = coursesRes.courses || [];
      const feedback = feedbackRes.feedback || [];

      setStats({
        totalStudents: users.filter(u => u.role === 'student').length,
        totalFaculty: users.filter(u => u.role === 'faculty').length,
        totalCourses: courses.length,
        totalFeedback: feedback.length,
      });

      setRecentFeedback(feedback.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: '🎓', label: 'Students', value: stats.totalStudents, color: 'purple' },
    { icon: '👨‍🏫', label: 'Faculty', value: stats.totalFaculty, color: 'blue' },
    { icon: '📚', label: 'Courses', value: stats.totalCourses, color: 'pink' },
    { icon: '📝', label: 'Feedbacks', value: stats.totalFeedback, color: 'green' },
  ];

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of the feedback system</p>
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

      <div className="content-card">
        <div className="card-header">
          <h3 className="card-title">Recent Feedback</h3>
        </div>
        {recentFeedback.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h4 className="empty-title">No feedback yet</h4>
            <p className="empty-text">Feedback submissions will appear here</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentFeedback.map((fb, i) => (
                <tr key={i}>
                  <td>{fb.studentId?.name || 'Unknown'}</td>
                  <td>{fb.courseId?.courseName || 'Unknown'}</td>
                  <td>{new Date(fb.submittedAt).toLocaleDateString()}</td>
                  <td><span className="badge badge-success">Submitted</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
