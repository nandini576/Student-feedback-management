import { useState, useEffect } from 'react';
import request from '../../services/api.js';
import './FacultyPages.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await request('/courses/my-courses');
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
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
    <div className="faculty-courses">
      <div className="page-header">
        <h1 className="page-title">My Courses</h1>
        <p className="page-subtitle">Courses assigned to you</p>
      </div>

      {courses.length === 0 ? (
        <div className="content-card">
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h4 className="empty-title">No courses assigned</h4>
            <p className="empty-text">Contact admin to get courses assigned</p>
          </div>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-header">
                <span className="course-code">{course.courseCode}</span>
                <span className="badge badge-info">{course.semester}</span>
              </div>
              <h3 className="course-name">{course.courseName}</h3>
              <div className="course-meta">
                <span>📅 {course.academicYear}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
