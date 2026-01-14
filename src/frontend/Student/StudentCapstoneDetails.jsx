import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';
import { apiClient } from '../../api/client';

export default function StudentCapstoneDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [capstone, setCapstone] = useState(null);
  const [citations, setCitations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [citationFormat, setCitationFormat] = useState('APA');

  useEffect(() => {
    loadCapstoneDetails();
  }, [id]);

  const loadCapstoneDetails = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getCapstoneDetails(id);
      const capstoneData = data?.capstone || data;
      setCapstone(capstoneData);

      // Fetch citations
      const citationsData = await fetch(
        `http://localhost:8000/api/student/capstones/${id}/citations`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
              localStorage.getItem('auth')
                ? JSON.parse(localStorage.getItem('auth')).access_token
                : ''
            }`,
          },
        }
      ).then((res) => res.json());
      setCitations(citationsData?.citations || {});
    } catch (err) {
      setError('Failed to load capstone details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateCitation = () => {
    if (!citations || !citations[citationFormat])
      return 'Citation not available';
    return citations[citationFormat];
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete this capstone? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.deleteStudentCapstone(id);
      if (response.status === 'success') {
        navigate('/student/submission-status');
      } else {
        setError(
          response.detail || response.message || 'Failed to delete capstone'
        );
      }
    } catch (err) {
      setError(err.detail || err.message || 'Failed to delete capstone');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <StudentNavbar />
        <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 mt-4">Loading capstone details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !capstone) {
    return (
      <>
        <StudentNavbar />
        <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow p-8 text-center">
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
                  d="M12 9v2m0 4v2m0 4v2M7 9h10M7 15h10M7 21h10"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {error || 'Capstone not found'}
              </h2>
              <button
                onClick={() => navigate('/student/submission-status')}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500"
              >
                Back to Submissions
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StudentNavbar />
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Navigation Buttons */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate('/student/submission-status')}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <span>←</span> Back to Submissions
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/student/capstone/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 font-medium transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-12 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{capstone.title}</h1>
                  <p className="text-purple-100 text-lg">
                    {capstone.abstract || capstone.description}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    capstone.status === 'approved'
                      ? 'bg-green-500 text-white'
                      : capstone.status === 'rejected'
                      ? 'bg-red-500 text-white'
                      : 'bg-yellow-400 text-gray-900'
                  }`}
                >
                  {capstone.status || 'Pending'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Project Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Authors
                  </h3>
                  <p className="text-gray-900">
                    {Array.isArray(capstone.authors)
                      ? capstone.authors.join(', ')
                      : capstone.authors}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Adviser
                  </h3>
                  <p className="text-gray-900">
                    {capstone.adviser || 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(capstone.keywords) &&
                    capstone.keywords.length > 0 ? (
                      capstone.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          {keyword.trim ? keyword.trim() : keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No keywords available
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Category
                  </h3>
                  <p className="text-gray-900">
                    {capstone.category || 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Submission Date
                  </h3>
                  <p className="text-gray-900">
                    {capstone.submitted_at
                      ? new Date(capstone.submitted_at).toLocaleDateString()
                      : 'Not specified'}
                  </p>
                </div>
              </div>

              <hr className="my-8" />

              {/* Feedback Section */}
              {capstone.admin_notes && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Admin Notes
                  </h3>
                  <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                    <p className="text-gray-700">{capstone.admin_notes}</p>
                  </div>
                </div>
              )}

              {/* Citations Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Citation
                </h3>

                {/* Citation Format Tabs */}
                <div className="flex gap-2 mb-4 border-b border-gray-300">
                  {['APA', 'MLA', 'Chicago', 'IEEE'].map((format) => (
                    <button
                      key={format}
                      onClick={() => setCitationFormat(format)}
                      className={`px-4 py-2 font-medium border-b-2 transition ${
                        citationFormat === format
                          ? 'border-purple-600 text-purple-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>

                {/* Citation Text */}
                <div className="bg-white p-4 rounded border border-gray-200 mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {generateCitation()}
                  </p>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateCitation());
                    alert('Citation copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded hover:from-purple-500 hover:to-indigo-500 text-sm font-medium"
                >
                  Copy Citation
                </button>
              </div>

              {/* File Download */}
              {capstone.fileUrl && (
                <div className="mt-8">
                  <a
                    href={capstone.fileUrl}
                    download
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 font-medium transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Project File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
