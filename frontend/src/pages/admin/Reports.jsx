import { useState, useEffect } from 'react';
import request from '../../services/api.js';
import './AdminPages.css';

const Reports = () => {
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0,
    courseCount: 0,
    studentCount: 0,
  });
  const [courseRatings, setCourseRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [feedbackRes, coursesRes, usersRes] = await Promise.all([
        request('/feedback'),
        request('/courses'),
        request('/users'),
      ]);

      const feedback = feedbackRes.feedback || [];
      const courses = coursesRes.courses || [];
      const users = usersRes.users || [];

      // Calculate overall stats
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
        totalFeedback: feedback.length,
        averageRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0,
        courseCount: courses.length,
        studentCount: users.filter(u => u.role === 'student').length,
      });

      // Calculate per-course ratings
      const courseStats = courses.map(course => {
        const courseFeedback = feedback.filter(f => f.courseId?._id === course._id);
        let courseTotal = 0;
        let courseCount = 0;
        courseFeedback.forEach(fb => {
          fb.responses?.forEach(r => {
            if (typeof r.answer === 'number') {
              courseTotal += r.answer;
              courseCount++;
            }
          });
        });
        return {
          ...course,
          avgRating: courseCount > 0 ? (courseTotal / courseCount).toFixed(1) : 'N/A',
          feedbackCount: courseFeedback.length,
        };
      });

      setCourseRatings(courseStats.sort((a, b) => b.avgRating - a.avgRating));
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-reports">
      <div className="page-header">
        <h1 className="page-title">Analytics & Reports</h1>
        <p className="page-subtitle">System-wide feedback analytics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">📝</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalFeedback}</span>
            <span className="stat-label">Total Feedback</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">⭐</div>
          <div className="stat-info">
            <span className="stat-value">{stats.averageRating}</span>
            <span className="stat-label">Avg Rating</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">📚</div>
          <div className="stat-info">
            <span className="stat-value">{stats.courseCount}</span>
            <span className="stat-label">Courses</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🎓</div>
          <div className="stat-info">
            <span className="stat-value">{stats.studentCount}</span>
            <span className="stat-label">Students</span>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h3 className="card-title">Course Performance Ranking</h3>
        </div>

        {courseRatings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h4 className="empty-title">No data available</h4>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Course</th>
                <th>Faculty</th>
                <th>Avg Rating</th>
                <th>Responses</th>
              </tr>
            </thead>
            <tbody>
              {courseRatings.map((course, i) => (
                <tr key={course._id}>
                  <td>
                    <span className={`badge ${i < 3 ? 'badge-success' : 'badge-info'}`}>
                      #{i + 1}
                    </span>
                  </td>
                  <td>{course.courseName}</td>
                  <td>{course.facultyId?.name || 'Unknown'}</td>
                  <td>
                    <span className="badge badge-success">{course.avgRating} / 5</span>
                  </td>
                  <td>{course.feedbackCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;
