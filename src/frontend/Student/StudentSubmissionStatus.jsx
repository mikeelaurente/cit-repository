import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';
import { useAuth } from '../../AuthContext';
import { apiClient } from '../../api/client';

export default function StudentSubmissionStatus() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getStudentCapstones();
      const submissionsArray = Array.isArray(data)
        ? data
        : data?.capstones || [];
      setSubmissions(submissionsArray);
    } catch (err) {
      setError('Failed to load submissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (filterStatus === 'all') return true;
    return submission.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      published: 'bg-purple-100 text-purple-800',
    };
    return styles[statusLower] || styles.pending;
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    switch (statusLower) {
      case 'approved':
        return '✓';
      case 'rejected':
        return '✗';
      case 'published':
        return '★';
      default:
        return '⏳';
    }
  };

  return (
    <>
      <StudentNavbar />
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Submissions
            </h1>
            <p className="text-gray-600">
              Track the status of your capstone project submissions
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Filter Buttons */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {['all', 'pending', 'approved', 'rejected', 'published'].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full font-medium transition whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Submissions List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="text-gray-600 mt-4">Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No submissions yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't submitted any capstone projects yet
              </p>
              <button
                onClick={() => navigate('/student/submit')}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 font-medium"
              >
                Submit Your First Capstone
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission, index) => (
                <div
                  key={submission.id || index}
                  onClick={() => navigate(`/student/capstone/${submission.id}`)}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-purple-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                            submission.status
                          )}`}
                        >
                          {getStatusIcon(submission.status)}{' '}
                          {submission.status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-gray-600 line-clamp-2">
                        {submission.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium text-gray-700">
                            Authors:
                          </span>{' '}
                          {submission.authors}
                        </div>
                        {submission.keywords && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Keywords:
                            </span>{' '}
                            {submission.keywords}
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">
                            Submitted:
                          </span>{' '}
                          {new Date(
                            submission.submitted_at
                          ).toLocaleDateString()}
                        </div>
                      </div>
                      {submission.feedback && (
                        <div className="mt-4 p-3 bg-purple-50 rounded border border-purple-200">
                          <p className="text-sm font-medium text-blue-900 mb-1">
                            Feedback:
                          </p>
                          <p className="text-sm text-blue-800">
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}

          {submissions.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/student/submit')}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 font-medium transition"
              >
                + Submit Another Capstone
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
