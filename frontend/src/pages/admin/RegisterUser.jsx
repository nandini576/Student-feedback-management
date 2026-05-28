import { useState } from 'react';
import request from '../../services/api.js';
import './AdminPages.css';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    designation: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === 'faculty') {
        payload.department = formData.department;
        payload.designation = formData.designation;
      }

      await request('/auth/register', 'POST', payload);
      setMessage('User registered successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: '',
        designation: '',
      });
    } catch (error) {
      setMessage(error.message || 'Failed to register user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register">
      <div className="page-header">
        <h1 className="page-title">Register New User</h1>
        <p className="page-subtitle">Create accounts for students or faculty</p>
      </div>

      <div className="content-card" style={{ maxWidth: '600px' }}>
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {formData.role === 'faculty' && (
            <>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  name="designation"
                  className="form-input"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
