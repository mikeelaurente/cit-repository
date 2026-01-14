import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

export default function CapstoneDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [capstone, setCapstone] = useState(null);
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCitationFormat, setSelectedCitationFormat] = useState('apa');
  const [copiedText, setCopiedText] = useState('');

  useEffect(() => {
    fetchCapstoneDetails();
  }, [id]);

  const fetchCapstoneDetails = async () => {
    setLoading(true);
    try {
      const capstoneRes = await apiClient.getPublicCapstoneDetails(id);

      if (capstoneRes.status === 'ok' || capstoneRes.data || capstoneRes.id) {
        const capstoneData = capstoneRes.data || capstoneRes;
        setCapstone(capstoneData);

        // Set citations from sections if available
        if (capstoneData.sections && Array.isArray(capstoneData.sections)) {
          setCitations(capstoneData.sections);
        }
      } else {
        setError('Failed to load capstone details');
      }
    } catch (err) {
      setError('An error occurred while loading capstone details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCitationText = (format) => {
    if (!capstone) return '';

    const { title, authors, year } = capstone;
    const authorsArray = Array.isArray(authors)
      ? authors
      : authors
      ? authors.split(',').map((a) => a.trim())
      : [];

    switch (format) {
      case 'apa':
        return `${authorsArray.join(', ')} (${year}). ${title}.`;
      case 'mla':
        return `${authorsArray.join(', ')}. "${title}." ${year}.`;
      case 'chicago':
        return `${authorsArray.join(', ')}. "${title}." Accessed in ${year}.`;
      default:
        return '';
    }
  };

  const handleCopyCitation = () => {
    const text = getCitationText(selectedCitationFormat);
    navigator.clipboard.writeText(text);
    setCopiedText(selectedCitationFormat);
    setTimeout(() => setCopiedText(''), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading capstone details...</p>
      </div>
    );
  }

  if (error || !capstone) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-purple-600 hover:text-purple-700 hover:underline mb-6 font-medium"
          >
            ← Back
          </button>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 text-lg">
              {error || 'Capstone not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-purple-600 hover:text-purple-700 hover:underline mb-6 font-medium"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-4">{capstone.title}</h1>
            <p className="text-purple-100 text-lg mb-2">
              By{' '}
              {Array.isArray(capstone.authors)
                ? capstone.authors.join(', ')
                : capstone.authors || 'Unknown'}
            </p>
            <p className="text-purple-100">Year: {capstone.year || 'N/A'}</p>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Adviser
                </h3>
                <p className="text-gray-700">{capstone.adviser || 'N/A'}</p>
              </div>
            </div>

            {/* Keywords */}
            {capstone.keywords &&
              (Array.isArray(capstone.keywords)
                ? capstone.keywords.length > 0
                : capstone.keywords) && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(capstone.keywords)
                      ? capstone.keywords
                      : capstone.keywords.split(',')
                    ).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {typeof keyword === 'string' ? keyword.trim() : keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Abstract */}
            {capstone.abstract && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Abstract
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {capstone.abstract}
                </p>
              </div>
            )}

            {/* Citation Section */}
            <div className="bg-purple-50 rounded-lg p-8 border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cite This Capstone
              </h3>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Citation Format
                </label>
                <div className="flex gap-4">
                  {['apa', 'mla', 'chicago'].map((format) => (
                    <label
                      key={format}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="citation"
                        value={format}
                        checked={selectedCitationFormat === format}
                        onChange={(e) =>
                          setSelectedCitationFormat(e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 font-medium capitalize">
                        {format}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-300 mb-4">
                <p className="text-gray-700 font-mono text-sm break-words">
                  {getCitationText(selectedCitationFormat)}
                </p>
              </div>

              <button
                onClick={handleCopyCitation}
                className={`transition duration-200 font-medium py-2 px-4 rounded-lg ${
                  copiedText === selectedCitationFormat
                    ? 'bg-green-600 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500'
                }`}
              >
                {copiedText === selectedCitationFormat
                  ? '✓ Copied'
                  : 'Copy Citation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
