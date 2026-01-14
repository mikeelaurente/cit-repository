import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../../assets/images/Logo CIT.png';
import { useAuth } from '../../AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const active =
    location.pathname === '/'
      ? 'home'
      : location.pathname === '/capstone'
      ? 'capstone'
      : location.pathname === '/about'
      ? 'about'
      : '';

  const handleLoginClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white/60 backdrop-blur-md supports-[backdrop-filter]:bg-white/40">
        <nav className="mx-auto max-w-7xl grid grid-cols-3 items-center px-6 h-12 md:h-22">
          {/* Logo */}
          <Link
            to="/"
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
            <li className="relative">
              <Link
                to="/"
                aria-current={active === 'home' ? 'page' : undefined}
                className={
                  (active === 'home'
                    ? 'text-indigo-600 '
                    : 'text-gray-700 hover:text-gray-900 ') +
                  'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm px-1 block'
                }
              >
                Home
                {active === 'home' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 -mb-2"></span>
                )}
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/capstone"
                aria-current={active === 'capstone' ? 'page' : undefined}
                className={
                  (active === 'capstone'
                    ? 'text-indigo-600 '
                    : 'text-gray-700 hover:text-gray-900 ') +
                  'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm px-1 block'
                }
              >
                Capstone
                {active === 'capstone' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 -mb-2"></span>
                )}
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/about"
                aria-current={active === 'about' ? 'page' : undefined}
                className={
                  (active === 'about'
                    ? 'text-indigo-600 '
                    : 'text-gray-700 hover:text-gray-900 ') +
                  'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm px-1 block'
                }
              >
                About Us
                {active === 'about' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 -mb-2"></span>
                )}
              </Link>
            </li>
          </ul>

          {/* Login Buttons */}
          <div className="hidden md:flex items-center justify-end w-60 md:w-72 gap-3">
            {user ? (
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-semibold px-6 py-2 rounded-full transition-colors shadow-md hover:shadow-lg"
              >
                Dashboard
              </button>
            ) : (
              <>
                {/* Student Login Button */}
                <button
                  onClick={() => navigate('/student/login')}
                  className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-semibold px-6 py-2 rounded-full transition-colors shadow-md hover:shadow-lg"
                >
                  Student Login
                </button>

                {/* Admin Login Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleLoginClick}
                    className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white font-semibold px-4 py-2 rounded-full transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    Admin
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isDropdownOpen ? 'rotate-180' : ''
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

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <button
                        onClick={() => {
                          navigate('/admin/login');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition-colors font-medium rounded-t-lg border-b border-gray-100"
                      >
                        Admin Login
                      </button>
                      <button
                        onClick={() => {
                          navigate('/admin/login');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition-colors font-medium rounded-b-lg"
                      >
                        Staff Login
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
