import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../api/client';

export default function StudentVerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!code.trim()) {
      setError('Verification code is required');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.verifyEmail(email, code);

      if (response.status === 'success') {
        setSuccessMessage(
          response.message ||
            'Email verified successfully! Redirecting to login...'
        );
        setTimeout(() => {
          navigate('/student/login');
        }, 2000);
      } else {
        setError(response.message || response.detail || 'Verification failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await apiClient.resendVerificationCode(email);

      if (response.status === 'success' || response.status === 'ok') {
        setSuccessMessage(
          response.message ||
            'A new verification code has been sent to your email'
        );
        setCode('');
      } else {
        setError(
          response.message || response.detail || 'Failed to resend code'
        );
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Verify Your Email
        </h1>
        <p className="text-gray-600 text-center mb-6">
          We've sent a verification code to
          <br />
          <span className="font-semibold">{email}</span>
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-lg tracking-widest"
              placeholder="000000"
              maxLength="6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition duration-200 disabled:bg-gray-400"
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">Didn't receive a code?</p>
          <button
            onClick={handleResendCode}
            disabled={loading}
            className="text-purple-600 hover:underline font-medium disabled:text-gray-400"
          >
            Resend Verification Code
          </button>
        </div>
      </div>
    </div>
  );
}
