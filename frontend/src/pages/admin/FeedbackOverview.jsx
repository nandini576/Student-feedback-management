import { useState, useEffect } from 'react';
import request from '../../services/api.js';
import './AdminPages.css';

const FeedbackOverview = () => {
  const [feedback, setFeedback] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feedbackRes, coursesRes] = await Promise.all([
        request('/feedback'),
        request('/courses'),
      ]);
      setFeedback(feedbackRes.feedback || []);
      setCourses(coursesRes.courses || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = selectedCourse === 'all'
    ? feedback
    : feedback.filter(f => f.courseId?._id === selectedCourse);

  const calculateAverageRating = (responses) => {
    const ratings = responses?.filter(r => typeof r.answer === 'number').map(r => r.answer) || [];
    if (ratings.length === 0) return 'N/A';
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-feedback">
      <div className="page-header">
        <h1 className="page-title">Feedback Overview</h1>
        <p className="page-subtitle">View all submitted feedback</p>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h3 className="card-title">All Feedback</h3>
          <select
            className="form-select"
            style={{ width: '200px' }}
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.courseName}</option>
            ))}
          </select>
        </div>

        {filteredFeedback.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h4 className="empty-title">No feedback found</h4>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Faculty</th>
                <th>Avg Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedback.map((fb) => (
                <tr key={fb._id}>
                  <td>{fb.studentId?.name || 'Unknown'}</td>
                  <td>{fb.courseId?.courseName || 'Unknown'}</td>
                  <td>{fb.facultyId?.name || 'Unknown'}</td>
                  <td>
                    <span className="badge badge-success">
                      {calculateAverageRating(fb.responses)} / 5
                    </span>
                  </td>
                  <td>{new Date(fb.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FeedbackOverview;
