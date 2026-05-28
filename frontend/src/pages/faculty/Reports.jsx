import { useState, useEffect } from 'react';
import request from '../../services/api.js';
import './FacultyPages.css';

const FacultyReports = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await request('/courses/my-courses');
      const coursesData = response.courses || [];
      setCourses(coursesData);
      if (coursesData.length > 0) {
        setSelectedCourse(coursesData[0]._id);
        fetchReport(coursesData[0]._id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const fetchReport = async (courseId) => {
    setLoading(true);
    try {
      const response = await request(`/reports/course/${courseId}`);
      setReportData(response.report);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    fetchReport(courseId);
  };

  if (loading && !reportData) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="faculty-reports">
      <div className="page-header">
        <h1 className="page-title">My Reports</h1>
        <p className="page-subtitle">Detailed analytics for your courses</p>
      </div>

      {courses.length === 0 ? (
        <div className="content-card">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h4 className="empty-title">No courses assigned</h4>
          </div>
        </div>
      ) : (
        <>
          <div className="content-card">
            <div className="card-header">
              <h3 className="card-title">Select Course</h3>
              <select
                className="form-select"
                style={{ width: '250px' }}
                value={selectedCourse || ''}
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.courseName}</option>
                ))}
              </select>
            </div>
          </div>

          {reportData && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon purple">📝</div>
                <div className="stat-info">
                  <span className="stat-value">{reportData.totalResponses}</span>
                  <span className="stat-label">Total Responses</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon pink">⭐</div>
                <div className="stat-info">
                  <span className="stat-value">{reportData.averageRating}</span>
                  <span className="stat-label">Average Rating</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue">👥</div>
                <div className="stat-info">
                  <span className="stat-value">{reportData.participationRate}%</span>
                  <span className="stat-label">Participation</span>
                </div>
              </div>
            </div>
          )}

          {reportData?.questionBreakdown && (
            <div className="content-card">
              <div className="card-header">
                <h3 className="card-title">Question Breakdown</h3>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Average</th>
                    <th>Responses</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.questionBreakdown.map((q, i) => (
                    <tr key={i}>
                      <td>{q.questionText}</td>
                      <td>
                        <span className="badge badge-success">{q.avgRating} / 5</span>
                      </td>
                      <td>{q.responseCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FacultyReports;
