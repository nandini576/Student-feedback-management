import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import request from '../../services/api.js';
import './StudentPages.css';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    feedbackSubmitted: 0,
    pendingFeedback: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
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

      setStats({
        totalCourses: courses.length,
        feedbackSubmitted: feedback.length,
        pendingFeedback: Math.max(0, courses.length - feedback.length),
      });

      setRecentCourses(courses.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: '📚', label: 'My Courses', value: stats.totalCourses, color: 'blue' },
    { icon: '✅', label: 'Feedback Submitted', value: stats.feedbackSubmitted, color: 'green' },
    { icon: '⏳', label: 'Pending Feedback', value: stats.pendingFeedback, color: 'orange' },
  ];

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="page-header">
        <h1 className="page-title">Student Dashboard</h1>
        <p className="page-subtitle">Welcome back! Manage your courses and feedback.</p>
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
            <h3 className="card-title">My Courses</h3>
            <Link to="/student/courses" className="btn btn-secondary">View All</Link>
          </div>
          {recentCourses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h4 className="empty-title">No courses enrolled</h4>
            </div>
          ) : (
            <div className="course-list">
              {recentCourses.map((course) => (
                <div key={course._id} className="course-list-item">
                  <div className="course-info">
                    <h4 className="course-list-name">{course.courseName}</h4>
                    <span className="course-list-code">{course.courseCode}</span>
                  </div>
                  <Link to="/student/feedback" className="btn btn-primary">
                    Give Feedback
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/student/courses" className="action-card">
              <span className="action-icon">📚</span>
              <span className="action-text">Browse Courses</span>
            </Link>
            <Link to="/student/feedback" className="action-card">
              <span className="action-icon">📝</span>
              <span className="action-text">Submit Feedback</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
