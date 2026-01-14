import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../../assets/images/Logo CIT.png';
import { useAuth } from '../../AuthContext';

export default function StudentNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/60 backdrop-blur-md supports-[backdrop-filter]:bg-white/40 border-b border-gray-200">
      <nav className="mx-auto max-w-7xl grid grid-cols-3 items-center px-6 h-12 md:h-20">
        {/* Logo */}
        <Link
          to="/student/dashboard"
          className="relative flex items-center w-60 md:w-72 h-full overflow-visible"
        >
          <img
            src={Logo}
            alt="CIT Repository"
            className="absolute left-0 top-1/2 -translate-y-1/2 mt-1 md:mt-1 h-32 md:h-40 w-auto"
          />
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center justify-center gap-10 text-sm font-medium text-gray-700">
          <li>
            <Link
              to="/student/dashboard"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/student/submit"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Submit
            </Link>
          </li>
          <li>
            <Link
              to="/student/submission-status"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              My Submissions
            </Link>
          </li>
          <li>
            <Link
              to="/capstone"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Browse
            </Link>
          </li>
        </ul>

        {/* User Menu */}
        <div className="hidden md:flex items-center justify-end w-60 md:w-72">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition font-medium"
            >
              <span className="truncate max-w-[150px]">
                {user?.user.email || 'User'}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm text-gray-600">Logged in as</p>
                  <p className="font-medium text-gray-900 truncate">
                    {user?.user?.email || 'User'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
