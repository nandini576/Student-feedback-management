import { useState, useEffect } from 'react';
import request from '../../services/api.js';
import './AdminPages.css';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    semester: '',
    academicYear: '',
    facultyId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, facultyRes] = await Promise.all([
        request('/courses'),
        request('/users?role=faculty'),
      ]);
      setCourses(coursesRes.courses || []);
      setFaculty(facultyRes.users || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await request('/courses', 'POST', formData);
      setFormData({ courseCode: '', courseName: '', semester: '', academicYear: '', facultyId: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      alert('Failed to create course');
    }
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await request(`/courses/${courseId}`, 'DELETE');
      fetchData();
    } catch (error) {
      alert('Failed to delete course');
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
    <div className="admin-courses">
      <div className="page-header">
        <h1 className="page-title">Manage Courses</h1>
        <p className="page-subtitle">Add and manage courses</p>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h3 className="card-title">All Courses</h3>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Course'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '24px', padding: '20px', background: '#f7fafc', borderRadius: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Course Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Course Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Semester</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Faculty</label>
                <select
                  className="form-select"
                  value={formData.facultyId}
                  onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                  required
                >
                  <option value="">Select Faculty</option>
                  {faculty.map((f) => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Create Course
            </button>
          </form>
        )}

        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h4 className="empty-title">No courses yet</h4>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Semester</th>
                <th>Year</th>
                <th>Faculty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.courseCode}</td>
                  <td>{course.courseName}</td>
                  <td>{course.semester}</td>
                  <td>{course.academicYear}</td>
                  <td>{course.facultyId?.name || 'Unknown'}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(course._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
