import { useState, useEffect } from 'react';
import request from '../../services/api.js';
import './AdminPages.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await request('/users');
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await request(`/users/${userId}`, 'DELETE');
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const filteredUsers = filter === 'all'
    ? users
    : users.filter(u => u.role === filter);

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'badge-danger',
      faculty: 'badge-info',
      student: 'badge-success',
    };
    return <span className={`badge ${badges[role]}`}>{role}</span>;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1 className="page-title">Manage Users</h1>
        <p className="page-subtitle">View and manage all system users</p>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h3 className="card-title">All Users</h3>
          <select
            className="form-select"
            style={{ width: '150px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h4 className="empty-title">No users found</h4>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(user._id)}
                    >
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

export default ManageUsers;
