import { useState, useEffect } from 'react';
import request from '../../services/api.js';
import './StudentPages.css';

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        request('/courses'),
        request('/courses/my-courses'),
      ]);
      setCourses(allRes.courses || []);
      setMyCourses(myRes.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await request('/courses/enroll', 'POST', { courseId });
      fetchCourses();
      alert('Enrolled successfully!');
    } catch (error) {
      alert(error.message || 'Failed to enroll');
    }
  };

  const isEnrolled = (courseId) => myCourses.some(c => c._id === courseId);

  const displayedCourses = activeTab === 'my'
    ? myCourses
    : courses;

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="student-courses">
      <div className="page-header">
        <h1 className="page-title">Courses</h1>
        <p className="page-subtitle">Browse and enroll in courses</p>
      </div>

      <div className="content-card">
        <div className="card-header">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Courses
            </button>
            <button
              className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
              onClick={() => setActiveTab('my')}
            >
              My Courses ({myCourses.length})
            </button>
          </div>
        </div>

        {displayedCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h4 className="empty-title">
              {activeTab === 'my' ? 'No enrolled courses' : 'No courses available'}
            </h4>
          </div>
        ) : (
          <div className="courses-grid">
            {displayedCourses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-header">
                  <span className="course-code">{course.courseCode}</span>
                  <span className="badge badge-info">{course.semester}</span>
                </div>
                <h3 className="course-name">{course.courseName}</h3>
                <div className="course-meta">
                  <span>📅 {course.academicYear}</span>
                  <span>👨‍🏫 {course.facultyId?.name || 'TBA'}</span>
                </div>
                {activeTab === 'all' && (
                  <button
                    className={`btn ${isEnrolled(course._id) ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ marginTop: '16px', width: '100%' }}
                    onClick={() => handleEnroll(course._id)}
                    disabled={isEnrolled(course._id)}
                  >
                    {isEnrolled(course._id) ? 'Enrolled' : 'Enroll Now'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCourses;
