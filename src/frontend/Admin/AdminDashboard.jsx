import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import V9Gradient from '../../assets/images/V9.svg';
import { useAuth } from '../../AuthContext';
import { apiClient } from '../../api/client';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const { logout, user } = useAuth();

  useEffect(() => {
    // Add shimmer animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-shimmer {
        animation: shimmer 2s infinite;
      }
    `;
    document.head.appendChild(style);

    // Fetch statistics data
    const fetchStatistics = async () => {
      try {
        const response = await apiClient.getDashboardStatistics();
        if (response.status === 'success') {
          setDashboardData(response);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Sample data
  const summaryCards = dashboardData
    ? [
        {
          title: 'Total Papers',
          value: dashboardData.cards.total_capstones.toString(),
          description: 'Total capstone projects',
          icon: 'document',
        },
        {
          title: 'Total Views',
          value: dashboardData.cards.total_views.toString(),
          description: 'Total views this period',
          icon: 'eye',
        },
        {
          title: 'Total Search',
          value: dashboardData.cards.total_search.toString(),
          description: 'Total searches performed',
          icon: 'search',
        },
        {
          title: 'Recently Uploaded',
          value: dashboardData.cards.recent_capstones_total.toString(),
          description: 'Recently uploaded capstones',
          icon: 'user',
        },
      ]
    : [
        {
          title: 'Total Papers',
          value: '0',
          description: 'Loading...',
          icon: 'document',
        },
        {
          title: 'Total Views',
          value: '0',
          description: 'Loading...',
          icon: 'eye',
        },
        {
          title: 'Total Search',
          value: '0',
          description: 'Loading...',
          icon: 'search',
        },
        {
          title: 'Recently Uploaded',
          value: '0',
          description: 'Loading...',
          icon: 'user',
        },
      ];

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'document':
        return (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case 'eye':
        return (
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        );
      case 'search':
        return (
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
        );
      case 'user':
        return (
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const mostSearched =
    dashboardData && dashboardData.most_searched
      ? Object.entries(dashboardData.most_searched).map(([name, value]) => ({
          name,
          value,
        }))
      : [];

  const viewsGrowth = [
    { month: 'Jan', value: 8000 },
    { month: 'Feb', value: 25000 },
    { month: 'Mar', value: 65000 },
    { month: 'April', value: 190000 },
    { month: 'May', value: 170000 },
    { month: 'June', value: 180000 },
  ];

  const mostViewed =
    dashboardData && dashboardData.most_viewed
      ? Object.entries(dashboardData.most_viewed).map(([title, views]) => ({
          title,
          views,
          authors: '',
        }))
      : [];

  const categoryColors = [
    'bg-blue-500',
    'bg-orange-500',
    'bg-yellow-400',
    'bg-green-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];

  const categories =
    dashboardData && dashboardData.categories
      ? (() => {
          const categoryEntries = Object.entries(dashboardData.categories);
          const totalCount = categoryEntries.reduce(
            (sum, [_, count]) => sum + count,
            0
          );
          return categoryEntries.map(([name, count], index) => ({
            name,
            percentage: (count / totalCount) * 100,
            color: categoryColors[index % categoryColors.length],
          }));
        })()
      : [
          { name: 'Web App', percentage: 33.3, color: 'bg-blue-500' },
          { name: 'Mobile App', percentage: 22.2, color: 'bg-orange-500' },
          { name: 'Networking', percentage: 22.2, color: 'bg-yellow-400' },
          { name: 'IoT', percentage: 22.2, color: 'bg-green-500' },
        ];

  // Skeleton Components with smooth shimmer effect
  const SkeletonShimmer = ({ className = '' }) => (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
    </div>
  );

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl p-6 shadow-md relative overflow-hidden">
      <SkeletonShimmer className="absolute inset-0" />
      <div className="relative">
        <div className="flex justify-between items-start mb-6">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-24 relative overflow-hidden">
            <SkeletonShimmer />
          </div>
          <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <SkeletonShimmer />
          </div>
        </div>
        <div className="mb-4">
          <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 relative overflow-hidden">
            <SkeletonShimmer />
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-32 relative overflow-hidden">
            <SkeletonShimmer />
          </div>
          <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <SkeletonShimmer />
          </div>
        </div>
      </div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 relative overflow-hidden">
      <SkeletonShimmer className="absolute inset-0 opacity-20" />
      <div className="relative">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-32 relative overflow-hidden">
            <SkeletonShimmer />
          </div>
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-28 relative overflow-hidden">
            <SkeletonShimmer />
          </div>
        </div>
        <div className="h-64 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded relative overflow-hidden">
          <SkeletonShimmer />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-full bg-gradient-to-b from-gray-200/50 via-transparent to-transparent rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 relative overflow-hidden">
      <SkeletonShimmer className="absolute inset-0 opacity-20" />
      <div className="relative">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-32 relative overflow-hidden">
            <SkeletonShimmer />
          </div>
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-28 relative overflow-hidden">
            <SkeletonShimmer />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className="flex items-start gap-4"
              style={{ animationDelay: `${num * 0.1}s` }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full relative overflow-hidden">
                <SkeletonShimmer />
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full mb-2 relative overflow-hidden">
                  <SkeletonShimmer />
                </div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-2/3 relative overflow-hidden">
                  <SkeletonShimmer />
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-12 mb-1 relative overflow-hidden">
                  <SkeletonShimmer />
                </div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-8 relative overflow-hidden">
                  <SkeletonShimmer />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SkeletonPieChart = () => (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 relative overflow-hidden">
      <SkeletonShimmer className="absolute inset-0 opacity-20" />
      <div className="relative">
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-24 mb-6 relative overflow-hidden">
          <SkeletonShimmer />
        </div>
        <div className="flex items-center gap-8">
          <div className="w-64 h-64 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 rounded-full relative overflow-hidden">
            <SkeletonShimmer />
            <div className="absolute inset-4 bg-white rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-gray-200/30 via-gray-100/30 to-gray-200/30 rounded-full"></div>
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className="flex items-center gap-2"
                style={{ animationDelay: `${num * 0.1}s` }}
              >
                <div className="w-3 h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full relative overflow-hidden">
                  <SkeletonShimmer />
                </div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 relative overflow-hidden">
                  <SkeletonShimmer />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-20 bg-purple-900 flex flex-col items-center py-6 gap-6 h-screen fixed left-0 top-0 overflow-hidden">
        {/* Dashboard Icon */}
        <div className="w-8 h-8 flex items-center justify-center text-white cursor-pointer hover:bg-purple-800 rounded-lg transition-colors">
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
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </div>

        {/* Document Icon */}
        <div
          onClick={() => navigate('/admin/capstone-projects')}
          className="w-8 h-8 flex items-center justify-center text-white cursor-pointer hover:bg-purple-800 rounded-lg transition-colors"
        >
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        {/* Users/People Icon - Only show for Admin */}
        {user?.user?.role === 'admin' && (
          <div
            onClick={() => navigate('/admin/account-management')}
            className="w-8 h-8 flex items-center justify-center text-white cursor-pointer hover:bg-purple-800 rounded-lg transition-colors"
          >
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        )}

        {/* Logout Icon */}
        <div
          className="mt-auto w-8 h-8 flex items-center justify-center text-white cursor-pointer hover:bg-purple-800 rounded-lg transition-colors"
          onClick={() => setIsLogoutModalOpen(true)}
        >
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800">
              Admin
            </span>{' '}
            <span className="text-gray-900">Dashboard</span>
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            summaryCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-start mb-6">
                  <p className="text-black text-sm font-medium">{card.title}</p>
                  <div className="text-purple-700">{getIcon(card.icon)}</div>
                </div>
                <div className="mb-4">
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-purple-600 to-purple-800">
                    {card.value}
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-gray-500 text-xs">{card.description}</p>
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Most Searched */}
          {isLoading ? (
            <>
              <SkeletonChart />
              <SkeletonChart />
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Most Searched
                  </h2>
                </div>
                <div className="space-y-5">
                  {mostSearched.map((item, index) => {
                    // Logarithmic scale calculation
                    const logMax = Math.log10(1000000);
                    const logValue = Math.log10(item.value);
                    const logPercentage = (logValue / logMax) * 100;
                    const barColor =
                      index % 2 === 0 ? 'bg-purple-800' : 'bg-purple-400';

                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-32 text-sm text-gray-700 flex-shrink-0">
                          {item.name}
                        </div>
                        <div className="flex-1 relative">
                          <div className="w-full bg-gray-200 rounded h-6">
                            <div
                              className={`${barColor} h-6 rounded`}
                              style={{ width: `${logPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-500 text-xs">
                  <span>0</span>
                  <span>1,000</span>
                  <span>10,000</span>
                  <span>100,000</span>
                  <span>1,000,000</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories */}
          {isLoading ? (
            <>
              <SkeletonPieChart />
              <SkeletonList />
              <SkeletonList />
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-8">
                  Categories
                </h2>
                <div className="flex items-center gap-12">
                  <div className="relative w-64 h-64 flex-shrink-0">
                    {(() => {
                      const centerX = 150;
                      const centerY = 135;
                      const radius = 110;
                      const depth = 18;
                      const ellipseRatio = 0.55;

                      const createExplodedSlice = (
                        startAngle,
                        endAngle,
                        offsetX,
                        offsetY,
                        color,
                        label
                      ) => {
                        const startRad = (startAngle * Math.PI) / 180;
                        const endRad = (endAngle * Math.PI) / 180;
                        const midRad =
                          (((startAngle + endAngle) / 2) * Math.PI) / 180;

                        const cx = centerX + offsetX;
                        const cy = centerY + offsetY;

                        // Top ellipse points
                        const x1 = cx + radius * Math.cos(startRad);
                        const y1 =
                          cy + radius * ellipseRatio * Math.sin(startRad);
                        const x2 = cx + radius * Math.cos(endRad);
                        const y2 =
                          cy + radius * ellipseRatio * Math.sin(endRad);

                        // Bottom ellipse points (for depth)
                        const x1Bottom = x1;
                        const y1Bottom = y1 + depth;
                        const x2Bottom = x2;
                        const y2Bottom = y2 + depth;

                        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

                        // Top surface
                        const topPath = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${
                          radius * ellipseRatio
                        } 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        // Side surface (for 3D)
                        const sidePath = `M ${x1} ${y1} L ${x1Bottom} ${y1Bottom} A ${radius} ${
                          radius * ellipseRatio
                        } 0 0 1 ${x2Bottom} ${y2Bottom} L ${x2} ${y2} Z`;

                        // Text position - better centered
                        const textX = cx + radius * 0.65 * Math.cos(midRad);
                        const textY = cy + radius * 0.45 * Math.sin(midRad);

                        return {
                          topPath,
                          sidePath,
                          textX,
                          textY,
                          color,
                          label,
                        };
                      };

                      // Create slices dynamically from categories
                      const slices = (() => {
                        const colorMap = {
                          'bg-blue-500': '#3b82f6',
                          'bg-orange-500': '#f97316',
                          'bg-yellow-400': '#facc15',
                          'bg-green-500': '#22c55e',
                          'bg-red-500': '#ef4444',
                          'bg-purple-500': '#a855f7',
                          'bg-pink-500': '#ec4899',
                          'bg-indigo-500': '#6366f1',
                        };

                        let startAngle = -90;
                        const offsets = [
                          { x: 0, y: -25 },
                          { x: 10, y: 5 },
                          { x: 0, y: 10 },
                          { x: -10, y: 5 },
                          { x: 0, y: -15 },
                          { x: 8, y: -8 },
                          { x: -8, y: -8 },
                          { x: 8, y: 8 },
                        ];

                        return categories.map((cat, idx) => {
                          const angle = (cat.percentage / 100) * 360;
                          const endAngle = startAngle + angle;
                          const slice = createExplodedSlice(
                            startAngle,
                            endAngle,
                            offsets[idx % offsets.length].x,
                            offsets[idx % offsets.length].y,
                            colorMap[cat.color] || '#3b82f6',
                            `${cat.percentage.toFixed(1)}%`
                          );
                          startAngle = endAngle;
                          return slice;
                        });
                      })();

                      return (
                        <svg
                          viewBox="0 0 300 270"
                          className="w-full h-full"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <defs>
                            <linearGradient
                              id="grad-blue"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#60a5fa" />
                              <stop offset="50%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#2563eb" />
                            </linearGradient>
                            <linearGradient
                              id="grad-orange"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#fb923c" />
                              <stop offset="50%" stopColor="#f97316" />
                              <stop offset="100%" stopColor="#ea580c" />
                            </linearGradient>
                            <linearGradient
                              id="grad-yellow"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#fde047" />
                              <stop offset="50%" stopColor="#facc15" />
                              <stop offset="100%" stopColor="#eab308" />
                            </linearGradient>
                            <linearGradient
                              id="grad-green"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#86efac" />
                              <stop offset="50%" stopColor="#22c55e" />
                              <stop offset="100%" stopColor="#16a34a" />
                            </linearGradient>
                            <linearGradient
                              id="grad-blue-side"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#3b82f6"
                                stopOpacity="0.75"
                              />
                              <stop
                                offset="100%"
                                stopColor="#1e3a8a"
                                stopOpacity="0.85"
                              />
                            </linearGradient>
                            <linearGradient
                              id="grad-orange-side"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#f97316"
                                stopOpacity="0.75"
                              />
                              <stop
                                offset="100%"
                                stopColor="#c2410c"
                                stopOpacity="0.85"
                              />
                            </linearGradient>
                            <linearGradient
                              id="grad-yellow-side"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#facc15"
                                stopOpacity="0.75"
                              />
                              <stop
                                offset="100%"
                                stopColor="#ca8a04"
                                stopOpacity="0.85"
                              />
                            </linearGradient>
                            <linearGradient
                              id="grad-green-side"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#22c55e"
                                stopOpacity="0.75"
                              />
                              <stop
                                offset="100%"
                                stopColor="#15803d"
                                stopOpacity="0.85"
                              />
                            </linearGradient>
                          </defs>

                          {/* Render sides first for proper layering */}
                          {slices.map((slice, idx) => {
                            const gradientIds = [
                              'grad-blue-side',
                              'grad-orange-side',
                              'grad-yellow-side',
                              'grad-green-side',
                            ];
                            return (
                              <path
                                key={`side-${idx}`}
                                d={slice.sidePath}
                                fill={`url(#${gradientIds[idx]})`}
                                style={{
                                  filter:
                                    'drop-shadow(0 3px 6px rgba(0,0,0,0.2))',
                                }}
                              />
                            );
                          })}

                          {/* Render top surfaces */}
                          {slices.map((slice, idx) => {
                            const gradientIds = [
                              'grad-blue',
                              'grad-orange',
                              'grad-yellow',
                              'grad-green',
                            ];
                            return (
                              <g key={idx}>
                                <path
                                  d={slice.topPath}
                                  fill={`url(#${gradientIds[idx]})`}
                                  style={{
                                    filter:
                                      'drop-shadow(0 4px 8px rgba(0,0,0,0.25))',
                                  }}
                                />
                                <text
                                  x={slice.textX}
                                  y={slice.textY}
                                  fontSize="14"
                                  fill="white"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  style={{
                                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                  }}
                                >
                                  {slice.label}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      );
                    })()}
                  </div>
                  <div className="space-y-4">
                    {categories.map((cat, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full flex-shrink-0 ${cat.color}`}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">
                          {cat.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Most Viewed */}
              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-gray-900">
                    Most Viewed
                  </h2>
                </div>
                <div className="space-y-4">
                  {mostViewed.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-purple-50 transition"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">{item.authors}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-bold text-purple-700">
                          {item.views}
                        </p>
                        <p className="text-xs text-gray-500">Views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Searched */}
              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-gray-900">
                    Most Searched
                  </h2>
                </div>
                <div className="space-y-4">
                  {mostSearched.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-purple-50 transition"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.name}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-bold text-purple-700">
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-500">Searches</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600/30 backdrop-blur-sm"
          onClick={() => setIsLogoutModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 text-center mb-2">
              Confirm Logout
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLoggingOut(true);
                  setIsLogoutModalOpen(false);
                  setTimeout(() => {
                    logout();
                    navigate('/');
                  }, 1500);
                }}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[60] min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 bg-white" aria-hidden />
          <div
            className="absolute inset-0 opacity-100"
            style={{
              backgroundImage: `url(${V9Gradient})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            aria-hidden
          />
          <div className="relative z-10 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="relative">
                <svg
                  className="animate-spin h-12 w-12 text-purple-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-xl"></div>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent block">
                  Logging out...
                </span>
                <span className="text-sm text-gray-500 block">
                  Redirecting to landing page
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
