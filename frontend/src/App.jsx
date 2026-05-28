import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import FacultyLayout from './layouts/FacultyLayout';
import StudentLayout from './layouts/StudentLayout';
import ProtectedRoute from './components/ProtectedRoutes';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import NotFound from './pages/public/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/DashBoard';
import RegisterUser from './pages/admin/RegisterUser';
import ManageUsers from './pages/admin/ManageUser';
import ManageCourses from './pages/admin/ManageCourses';
import ManageQuestions from './pages/admin/ManageQuestions';
import FeedbackOverview from './pages/admin/FeedbackOverview';
import AdminReports from './pages/admin/Reports';

// Faculty Pages
import FacultyDashboard from './pages/faculty/DashBoard';
import MyCourses from './pages/faculty/MyCourse';
import CourseFeedback from './pages/faculty/CourseFeedback';
import FacultyReports from './pages/faculty/Reports';

// Student Pages
import StudentDashboard from './pages/student/DashBoard';
import ViewCourses from './pages/student/ViewCourses';
import SubmitFeedback from './pages/student/SubmitFeedback';

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loader onLoadingComplete={() => setLoading(false)} />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="register" element={<RegisterUser />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="questions" element={<ManageQuestions />} />
        <Route path="feedback" element={<FeedbackOverview />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Faculty Routes */}
      <Route
        path="/faculty/*"
        element={
          <ProtectedRoute allowedRole="faculty">
            <FacultyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FacultyDashboard />} />
        <Route path="courses" element={<MyCourses />} />
        <Route path="feedback" element={<CourseFeedback />} />
        <Route path="reports" element={<FacultyReports />} />
      </Route>

      {/* Student Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<ViewCourses />} />
        <Route path="feedback" element={<SubmitFeedback />} />
      </Route>
    </Routes>
  );
}

export default App;
