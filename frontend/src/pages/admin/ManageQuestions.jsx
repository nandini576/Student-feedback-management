import { useState, useEffect } from 'react';
import request from '../../services/api.js';
import './AdminPages.css';

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'rating',
    category: 'general',
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await request('/questions');
      setQuestions(response.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await request('/questions', 'POST', formData);
      setFormData({ questionText: '', questionType: 'rating', category: 'general' });
      setShowForm(false);
      fetchQuestions();
    } catch (error) {
      alert('Failed to create question');
    }
  };

  const handleDelete = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await request(`/questions/${questionId}`, 'DELETE');
      fetchQuestions();
    } catch (error) {
      alert('Failed to delete question');
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
    <div className="admin-questions">
      <div className="page-header">
        <h1 className="page-title">Manage Questions</h1>
        <p className="page-subtitle">Create and manage feedback questions</p>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h3 className="card-title">All Questions</h3>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Question'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '24px', padding: '20px', background: '#f7fafc', borderRadius: '12px' }}>
            <div className="form-group">
              <label className="form-label">Question Text</label>
              <textarea
                className="form-textarea"
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Question Type</label>
                <select
                  className="form-select"
                  value={formData.questionType}
                  onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
                >
                  <option value="rating">Rating (1-5)</option>
                  <option value="text">Text Answer</option>
                  <option value="yesno">Yes/No</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="teaching">Teaching Quality</option>
                  <option value="content">Course Content</option>
                  <option value="facilities">Facilities</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Create Question
            </button>
          </form>
        )}

        {questions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">❓</div>
            <h4 className="empty-title">No questions yet</h4>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Type</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q._id}>
                  <td>{q.questionText}</td>
                  <td><span className="badge badge-info">{q.questionType}</span></td>
                  <td><span className="badge badge-warning">{q.category}</span></td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(q._id)}>
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

export default ManageQuestions;
