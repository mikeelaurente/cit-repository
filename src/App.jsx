import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Home from './frontend/Landing Page/Home';
import CapstoneSearch from './frontend/Landing Page/CapstoneSearch';
import AboutUs from './frontend/Landing Page/AboutUs';
import AdminLoginPage from './frontend/Admin/AdminLoginPage';
import AdminDashboard from './frontend/Admin/AdminDashboard';
import CapstoneProjects from './frontend/Admin/CapstoneProjects';
import AdminAccountManagement from './frontend/Admin/AdminAccountManagement';
import StudentSignup from './frontend/Student/StudentSignup';
import StudentVerifyEmail from './frontend/Student/StudentVerifyEmail';
import StudentLogin from './frontend/Student/StudentLogin';
import StudentForgotPassword from './frontend/Student/StudentForgotPassword';
import StudentResetPassword from './frontend/Student/StudentResetPassword';
import StudentSubmitCapstone from './frontend/Student/StudentSubmitCapstone';
import StudentSubmissionStatus from './frontend/Student/StudentSubmissionStatus';
import StudentCapstoneDetails from './frontend/Student/StudentCapstoneDetails';
import StudentEditCapstone from './frontend/Student/StudentEditCapstone';
import StudentDashboard from './frontend/Student/StudentDashboard';
import CapstoneDetails from './frontend/CapstoneDetails';
import { AuthProvider } from './AuthContext';
import DashboardLayout from './DashboardLayout';
import AuthenticatedRoute from './AuthenticatedRoute';
import { CapstoneProjectsProvider } from './CapstoneProjectsContext';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/capstone" element={<CapstoneSearch />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/capstone/:id" element={<CapstoneDetails />} />

          {/* Default Login (redirects to student login) */}
          <Route path="/login" element={<StudentLogin />} />

          {/* Student Routes */}
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route
            path="/student/verify-email"
            element={<StudentVerifyEmail />}
          />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route
            path="/student/dashboard"
            element={
              <AuthenticatedRoute>
                <StudentDashboard />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/student/forgot-password"
            element={<StudentForgotPassword />}
          />
          <Route
            path="/student/reset-password"
            element={<StudentResetPassword />}
          />
          <Route
            path="/student/submit"
            element={
              <AuthenticatedRoute>
                <StudentSubmitCapstone />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/student/submission-status"
            element={
              <AuthenticatedRoute>
                <StudentSubmissionStatus />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/student/capstone/:id"
            element={
              <AuthenticatedRoute>
                <StudentCapstoneDetails />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/student/capstone/:id/edit"
            element={
              <AuthenticatedRoute>
                <StudentEditCapstone />
              </AuthenticatedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          <Route
            path="/admin"
            element={
              <AuthenticatedRoute>
                <DashboardLayout />
              </AuthenticatedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route
              path="capstone-projects"
              element={
                <CapstoneProjectsProvider>
                  <CapstoneProjects />
                </CapstoneProjectsProvider>
              }
            />
            <Route
              path="account-management"
              element={<AdminAccountManagement />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
