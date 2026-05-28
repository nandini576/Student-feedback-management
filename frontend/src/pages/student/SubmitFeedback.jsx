import { useState, useEffect } from 'react';
import request from '../../services/api.js';
import './StudentPages.css';

const SubmitFeedback = () => {
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, questionsRes] = await Promise.all([
        request('/courses/my-courses'),
        request('/questions'),
      ]);
      setCourses(coursesRes.courses || []);
      setQuestions(questionsRes.questions || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert('Please select a course');
      return;
    }

    setSubmitting(true);
    try {
      const formattedResponses = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer: typeof answer === 'number' ? answer : answer,
      }));

      await request('/feedback', 'POST', {
        courseId: selectedCourse,
        responses: formattedResponses,
      });

      setSubmitted(true);
      setResponses({});
      setSelectedCourse('');
    } catch (error) {
      alert(error.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (question) => {
    switch (question.questionType) {
      case 'rating':
        return (
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${responses[question._id] >= star ? 'active' : ''}`}
                onClick={() => handleResponseChange(question._id, star)}
              >
                ⭐
              </button>
            ))}
            <span className="rating-value">
              {responses[question._id] ? `${responses[question._id]}/5` : 'Select rating'}
            </span>
          </div>
        );
      case 'yesno':
        return (
          <div className="yesno-input">
            <button
              type="button"
              className={`yesno-btn ${responses[question._id] === 'yes' ? 'active' : ''}`}
              onClick={() => handleResponseChange(question._id, 'yes')}
            >
              Yes
            </button>
            <button
              type="button"
              className={`yesno-btn ${responses[question._id] === 'no' ? 'active' : ''}`}
              onClick={() => handleResponseChange(question._id, 'no')}
            >
              No
            </button>
          </div>
        );
      default:
        return (
          <textarea
            className="form-textarea"
            placeholder="Enter your answer..."
            value={responses[question._id] || ''}
            onChange={(e) => handleResponseChange(question._id, e.target.value)}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="student-feedback">
        <div className="content-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ color: '#1a202c', marginBottom: '12px' }}>Thank You!</h2>
          <p style={{ color: '#718096', marginBottom: '24px' }}>
            Your feedback has been submitted successfully.
          </p>
          <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-feedback">
      <div className="page-header">
        <h1 className="page-title">Submit Feedback</h1>
        <p className="page-subtitle">Share your thoughts about your courses</p>
      </div>

      <div className="content-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Course</label>
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">Choose a course...</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName} ({course.courseCode})
                </option>
              ))}
            </select>
          </div>

          {questions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">❓</div>
              <h4 className="empty-title">No questions available</h4>
            </div>
          ) : (
            <div className="questions-list">
              {questions.map((question, index) => (
                <div key={question._id} className="question-item">
                  <div className="question-number">{index + 1}</div>
                  <div className="question-content">
                    <p className="question-text">{question.questionText}</p>
                    <span className="question-category">{question.category}</span>
                    {renderQuestionInput(question)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || questions.length === 0}
            style={{ marginTop: '24px', width: '100%' }}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitFeedback;
