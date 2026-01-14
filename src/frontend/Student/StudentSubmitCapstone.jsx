import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';
import { useAuth } from '../../AuthContext';
import { apiClient } from '../../api/client';

export default function StudentSubmitCapstone() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Only PDF and Word documents are allowed');
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.uploadStudentCapstone(file);

      if (response.status === 'success') {
        setSuccess('Capstone uploaded successfully and is pending review');
        setTimeout(() => {
          navigate('/student/submission-status');
        }, 2000);
      } else {
        // Handle error responses with detail message (e.g., 400 Bad Request)
        const errorMessage =
          response.detail || response.message || 'Failed to submit capstone';
        setError(errorMessage);
      }
    } catch (err) {
      // Handle network errors or parsing errors
      const errorMessage =
        err.detail || err.message || 'An error occurred while submitting';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StudentNavbar />
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Upload Capstone Project
            </h1>
            <p className="text-gray-600 mb-8">
              Select your capstone project file to upload
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Upload Your Project File
                  </h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="fileInput"
                    />
                    <label htmlFor="fileInput" className="cursor-pointer">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-7"
                        />
                      </svg>
                      <p className="text-gray-600 mb-2">
                        Click to select or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF or Word documents (Max 50MB)
                      </p>
                    </label>
                  </div>
                  {fileName && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">
                        ✓ File selected: {fileName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/student/dashboard')}
                  disabled={loading}
                  className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Uploading...' : 'Upload Capstone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
