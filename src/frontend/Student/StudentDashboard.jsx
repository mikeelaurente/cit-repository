import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';
import { useAuth } from '../../AuthContext';
import { apiClient } from '../../api/client';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    submissions: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getStudentDashboard();
      if (response && response.status === 'success' && response.data) {
        setStats(response.data);
      } else if (response && response.data) {
        // Handle case where status might be omitted but data is present
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <StudentNavbar />
      <div className="min-h-screen bg-white pt-24 md:pt-28">
        <div className="mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800">
                Student
              </span>{' '}
              <span className="text-gray-900">Dashboard</span>
            </h1>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Submit Capstone Card */}
            <div
              onClick={() => navigate('/student/submit')}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <p className="text-black text-sm font-medium">
                  Submit Capstone
                </p>
                <div className="text-purple-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-xs">
                  Upload your capstone project file
                </p>
              </div>
            </div>

            {/* Check Submission Status Card */}
            <div
              onClick={() => navigate('/student/submission-status')}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <p className="text-black text-sm font-medium">
                  Submission Status
                </p>
                <div className="text-purple-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-xs">
                  Track your submission progress
                </p>
              </div>
            </div>

            {/* Browse Capstones Card */}
            <div
              onClick={() => navigate('/capstone')}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <p className="text-black text-sm font-medium">
                  Browse Capstones
                </p>
                <div className="text-green-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-xs">
                  Explore published capstone projects
                </p>
              </div>
            </div>

            {/* Search Capstones Card */}
            <div
              onClick={() => navigate('/capstone-search')}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <p className="text-black text-sm font-medium">
                  Search Capstones
                </p>
                <div className="text-purple-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-xs">
                  Search and filter capstone projects
                </p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <p className="text-black text-sm font-medium">Submissions</p>
                <div className="text-purple-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600">
                  {loading ? '-' : stats.submissions}
                </p>
              </div>
              <p className="text-gray-500 text-xs">Total capstones submitted</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <p className="text-black text-sm font-medium">Approved</p>
                <div className="text-purple-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600">
                  {loading ? '-' : stats.approved}
                </p>
              </div>
              <p className="text-gray-500 text-xs">Approved submissions</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <p className="text-black text-sm font-medium">Pending</p>
                <div className="text-purple-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600">
                  {loading ? '-' : stats.pending}
                </p>
              </div>
              <p className="text-gray-500 text-xs">Awaiting review</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <p className="text-black text-sm font-medium">Rejected</p>
                <div className="text-purple-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600">
                  {loading ? '-' : stats.rejected}
                </p>
              </div>
              <p className="text-gray-500 text-xs">Requires revision</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
