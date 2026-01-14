export default function Capstone() {
  const cards = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title:
      'AgriLearn: A Web-based Production Planning System for High-Value Crops',
    author: 'Alipante et. al.',
    year: 2023,
    tags: ['AI', 'Web', 'IoT'],
  }));

  return (
    <section
      id="capstone"
      className="relative bg-white scroll-mt-24 md:scroll-mt-32 pt-8 md:pt-10 pb-16"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 tracking-tight">
          CAPSTONE REPOSITORY
        </h2>

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">Filter:</span>
            <button className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm text-purple-700 shadow-sm hover:bg-purple-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
              All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="relative w-full md:max-w-sm group">
            <input
              type="text"
              placeholder="Search capstone..."
              className="w-full rounded-full border border-purple-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 104.2 12.06l4.24 4.24a.75.75 0 101.06-1.06l-4.24-4.24A6.75 6.75 0 0010.5 3.75zm-5.25 6.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cards.map((card) => (
            <article
              key={card.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-3">
                {card.title}
              </h3>
              <div className="mt-3 text-xs text-gray-500 space-y-0.5">
                <p>Author: {card.author}</p>
                <p>Year: {card.year}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-purple-600/15 text-purple-700 text-[11px] font-semibold px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:shadow-md hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 transition-all"
            aria-label="Previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M13.28 5.22a.75.75 0 010 1.06L8.56 11l4.72 4.72a.75.75 0 11-1.06 1.06l-5.25-5.25a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <span className="text-sm text-gray-600">1 of 30</span>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:shadow-md hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 transition-all"
            aria-label="Next page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
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
    </section>
  );
}
