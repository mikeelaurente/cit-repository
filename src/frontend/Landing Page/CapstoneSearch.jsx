import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import V9Gradient from '../../assets/images/V9.svg';
let abortController = new AbortController();

export default function CapstoneSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [isGeneratingSummary, setGeneratingSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const apiUrl = 'http://localhost:8000';

  const hasResults = searchQuery.trim() !== '' && searchResults.length > 0;

  // Check for search query in URL on mount
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
      setShowResults(true);
      // Trigger search with the query from URL
      setTimeout(() => {
        performSearch(queryParam, 1);
        generateSummary(queryParam);
      }, 100);
    }
  }, []);

  async function performSearch(query, page = 1) {
    try {
      const res = await fetch(
        apiUrl +
          `/api/search?q=${encodeURIComponent(
            query
          )}&page=${page}&limit=${itemsPerPage}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await res.json();
      setSearchResults(data.results ?? []);
      setTotalResults(data.total ?? 0);
    } catch (e) {
      setSearchResults([]);
      setTotalResults(0);
    }
  }

  async function generateSummary(text = '') {
    try {
      setAiSummary('');
      if (isGeneratingSummary) {
        console.log(abortController.signal);
        abortController.abort();
        abortController = new AbortController();
      }
      setGeneratingSummary(true);
      const res = await fetch(apiUrl + `/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
        signal: abortController.signal,
      });
      const data = await res.json();
      setAiSummary(data.summary || '');
    } catch {
      setAiSummary('');
    } finally {
      setGeneratingSummary(false);
    }
  }

  async function searchCapstones(page = 1) {
    try {
      const res = await fetch(
        apiUrl +
          `/api/search?q=${encodeURIComponent(
            searchQuery
          )}&page=${page}&limit=${itemsPerPage}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await res.json();
      setSearchResults(data.results ?? []);
      setTotalResults(data.total ?? 0);
    } catch (e) {
      setSearchResults([]);
      setTotalResults(0);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      setCurrentPage(1);
      // Update URL with search query
      navigate(`?q=${encodeURIComponent(searchQuery)}`);
      setTimeout(async () => {
        await searchCapstones(1);
        setIsLoading(false);
        setShowResults(true);
        await generateSummary(searchQuery);
      }, 100);
    }
  }

  function handleInputChange(e) {
    const value = e.target.value;
    setSearchQuery(value);

    // Don't auto-search, only clear results if empty
    if (value.trim() === '') {
      setShowResults(false);
      setIsLoading(false);
    }
  }

  async function handleResultsSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      setCurrentPage(1);
      abortController.abort();
      abortController = new AbortController();
      // Update URL with search query
      navigate(`?q=${encodeURIComponent(searchQuery)}`);
      await searchCapstones(1);
      setIsLoading(false);
      setShowResults(true);
      await generateSummary(searchQuery);
    }
  }

  function handleFilterChange(e) {
    setFilterType(e.target.value);
    if (showResults && searchQuery.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }

  function handleCategoryChange(e) {
    setCategoryFilter(e.target.value);
    if (showResults && searchQuery.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {isLoading ? (
        <section className="relative overflow-hidden min-h-screen flex items-center justify-center pt-16 md:pt-24 animate-fade-in">
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
                  Loading Capstone Repository...
                </span>
                <span className="text-sm text-gray-500 block">
                  Please wait while we fetch your results
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : !showResults ? (
        <section className="relative overflow-hidden min-h-screen flex items-center pt-16 md:pt-24">
          {/* V9.svg gradient background */}
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

          <div className="relative mx-auto max-w-4xl px-6 w-full pt-8 md:pt-12 pb-16">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                IT{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-purple-700 via-purple-500 to-purple-300">
                  Capstone
                </span>{' '}
                Repository
              </h1>
              <p className="mt-4 text-base md:text-lg text-gray-600">
                Your Gateway to Capstone Research and Discovery.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={handleSearch}
                className="mt-8 flex justify-center animate-fade-in-up"
              >
                <div className="relative w-full max-w-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search capstone..."
                    className="relative w-full rounded-full border-2 border-gray-300 bg-white/80 backdrop-blur-sm pl-6 pr-28 py-4 text-base text-gray-700 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:shadow-purple-500/20 transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-purple-400 to-transparent"></div>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-purple-50 hover:scale-110 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-full"
                      aria-label="Voice search"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 text-purple-600"
                      >
                        <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                        <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 01-13.5 0v-1.5A.75.75 0 016 10.5z" />
                      </svg>
                    </button>
                    <button
                      type="submit"
                      className="p-1.5 hover:bg-purple-50 hover:scale-110 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-full"
                      aria-label="Search"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 text-purple-600"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : (
        <div className="min-h-screen bg-white flex flex-col">
          <section className="relative pt-24 md:pt-32 pb-16 animate-fade-in flex-1">
            {/* V9.svg gradient background */}
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
            <div className="relative mx-auto max-w-7xl px-6">
              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-snug md:leading-tight">
                Search Results
              </h2>

              {/* Filters and Search Bar */}
              <div className="mb-8 flex flex-row items-center justify-center gap-4">
                <form
                  onSubmit={handleResultsSearch}
                  className="relative w-full md:max-w-sm group"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search capstone..."
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleResultsSearch(e)
                    }
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 104.2 12.06l4.24 4.24a.75.75 0 101.06-1.06l-4.24-4.24A6.75 6.75 0 0010.5 3.75zm-5.25 6.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </form>
              </div>

              {/* Result Cards - List Format */}
              {(aiSummary || isGeneratingSummary) && (
                <header className="mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                        AI
                      </div>
                      <div>
                        <h1 className="text-2xl font-medium">AI Summary</h1>
                      </div>
                    </div>
                    <div className="ml-auto text-sm text-slate-500">
                      <em>(runs locally)</em>
                    </div>
                  </div>
                  <div
                    className="text-sm text-slate-500"
                    dangerouslySetInnerHTML={{
                      __html: isGeneratingSummary
                        ? 'Generating summary...Please wait...'
                        : aiSummary
                        ? `<div class="p-4">
                          ${aiSummary}
                        </div>`
                        : 'Failed to generate summary.',
                    }}
                  ></div>
                </header>
              )}
              <div className="space-y-4 mb-10">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="inline-flex flex-col items-center gap-3">
                      <svg
                        className="animate-spin h-8 w-8 text-purple-600"
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
                      <span className="text-sm text-gray-500">
                        Searching...
                      </span>
                    </div>
                  </div>
                ) : hasResults ? (
                  // Show all matching cards with fade-in animation

                  searchResults.map((card, index) => (
                    <article
                      key={card.project_id}
                      onClick={() => navigate(`/capstone/${card.project_id}`)}
                      className="rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-card cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {card.title}
                      </h3>

                      {/* Authors and Year */}
                      <p className="text-sm text-gray-600 mb-4">
                        Authors: {card.authors.join(', ')} | Year: {card.year}
                      </p>

                      {/* Abstract Section */}
                      <div className="mb-4">
                        <p className="font-semibold text-gray-900 mb-2">
                          Abstract
                        </p>
                        <p
                          className="text-sm text-gray-700 leading-relaxed line-clamp-5"
                          dangerouslySetInnerHTML={{
                            __html:
                              card.snippets.join('<div className="my-2" />') ||
                              'No abstract available for this capstone project.',
                          }}
                        ></p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {card.keywords &&
                          card.keywords.map((keyword, keywordIndex) => (
                            <span
                              key={keywordIndex}
                              className="inline-block rounded-full bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1"
                            >
                              {keyword}
                            </span>
                          ))}
                      </div>
                    </article>
                  ))
                ) : (
                  // No results message
                  <div className="flex flex-col items-center justify-center py-16">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-16 w-16 text-gray-400 mb-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172-1.025 3.072-1.025 4.243 0 1.174 1.025 1.174 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                      />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Results Found
                    </h3>
                    <p className="text-gray-600 text-center max-w-md">
                      We couldn't find any capstone projects matching your
                      search. Try adjusting your filters or search query.
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">
                      Items per page:
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        const prevPage = Math.max(1, currentPage - 1);
                        setCurrentPage(prevPage);
                        searchCapstones(prevPage);
                      }}
                      disabled={currentPage === 1}
                      className={`inline-flex items-center justify-center rounded-lg p-2 text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all ${
                        currentPage === 1
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:text-purple-700'
                      }`}
                      aria-label="Previous page"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M13.28 5.22a.75.75 0 010 1.06L8.56 11l4.72 4.72a.75.75 0 11-1.06 1.06l-5.25-5.25a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <span className="text-sm font-semibold text-gray-700">
                      <span className="text-purple-600">{currentPage}</span> of{' '}
                      {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextPage = Math.min(totalPages, currentPage + 1);
                        setCurrentPage(nextPage);
                        searchCapstones(nextPage);
                      }}
                      disabled={currentPage === totalPages}
                      className={`inline-flex items-center justify-center rounded-lg p-2 text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all ${
                        currentPage === totalPages
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:text-purple-700'
                      }`}
                      aria-label="Next page"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.72 5.22a.75.75 0 000 1.06L15.44 11l-4.72 4.72a.75.75 0 101.06 1.06l5.25-5.25a.75.75 0 000-1.06l-5.25-5.25a.75.75 0 00-1.06 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gradient-to-r from-purple-200 via-purple-400 to-purple-900 text-white py-3 mt-auto">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-sm md:text-base">
                IT Capstone Repository System © 2025 College of Information
                Technology - All Rights Reserved.
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
