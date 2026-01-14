import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';
import { apiClient } from '../../api/client';

export default function StudentEditCapstone() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [capstone, setCapstone] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    abstract: '',
    authors: [],
    keywords: [],
    category: '',
    adviser: '',
  });

  useEffect(() => {
    loadCapstoneDetails();
  }, [id]);

  const loadCapstoneDetails = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getCapstoneDetails(id);
      const capstoneData = data?.capstone || data;
      setCapstone(capstoneData);

      // Populate form with existing data
      setFormData({
        title: capstoneData.title || '',
        year: capstoneData.year || new Date().getFullYear(),
        abstract: capstoneData.abstract || '',
        authors: Array.isArray(capstoneData.authors)
          ? capstoneData.authors
          : [],
        keywords: Array.isArray(capstoneData.keywords)
          ? capstoneData.keywords
          : [],
        category: capstoneData.category || '',
        adviser: capstoneData.adviser || '',
      });
    } catch (err) {
      setError('Failed to load capstone details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value,
    }));
  };

  const handleAuthorsChange = (e) => {
    const value = e.target.value;
    const authorsArray = value
      .split(',')
      .map((author) => author.trim())
      .filter((author) => author.length > 0);
    setFormData((prev) => ({
      ...prev,
      authors: authorsArray,
    }));
  };

  const handleKeywordsChange = (e) => {
    const value = e.target.value;
    const keywordsArray = value
      .split(',')
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);
    setFormData((prev) => ({
      ...prev,
      keywords: keywordsArray,
    }));
  };

  const addAuthor = () => {
    setFormData((prev) => ({
      ...prev,
      authors: [...prev.authors, ''],
    }));
  };

  const removeAuthor = (index) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index),
    }));
  };

  const updateAuthor = (index, value) => {
    setFormData((prev) => {
      const newAuthors = [...prev.authors];
      newAuthors[index] = value;
      return { ...prev, authors: newAuthors };
    });
  };

  const addKeyword = () => {
    setFormData((prev) => ({
      ...prev,
      keywords: [...prev.keywords, ''],
    }));
  };

  const removeKeyword = (index) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  const updateKeyword = (index, value) => {
    setFormData((prev) => {
      const newKeywords = [...prev.keywords];
      newKeywords[index] = value;
      return { ...prev, keywords: newKeywords };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.abstract.trim()) {
      setError('Abstract is required');
      return;
    }
    if (formData.authors.length === 0) {
      setError('At least one author is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await apiClient.updateCapstone(id, {
        title: formData.title,
        year: formData.year,
        abstract: formData.abstract,
        authors: formData.authors,
        keywords: formData.keywords,
        category: formData.category,
        adviser: formData.adviser,
      });

      if (response.status === 'success' || response.message) {
        navigate(`/student/capstone/${id}`);
      } else {
        setError(
          response.detail || response.message || 'Failed to update capstone'
        );
      }
    } catch (err) {
      const errorMessage =
        err.detail || err.message || 'An error occurred while updating';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
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

  if (!capstone) {
    return (
      <>
        <StudentNavbar />
        <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Capstone not found
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
          <div className="mb-6">
            <button
              onClick={() => navigate(`/student/capstone/${id}`)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <span>←</span> Back to Capstone
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Capstone Project
            </h1>
            <p className="text-gray-600 mb-8">
              Update your capstone project details
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter capstone project title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="Year"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">
                      Mobile Development
                    </option>
                    <option value="IoT">IoT</option>
                    <option value="AI/Machine Learning">
                      AI/Machine Learning
                    </option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Game Development">Game Development</option>
                    <option value="E-Learning">E-Learning</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authors *
                </label>
                <div className="space-y-2">
                  {formData.authors.map((author, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => updateAuthor(index, e.target.value)}
                        placeholder="Enter author name"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeAuthor(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAuthor}
                    className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    + Add Author
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adviser
                </label>
                <input
                  type="text"
                  name="adviser"
                  value={formData.adviser}
                  onChange={handleInputChange}
                  placeholder="Enter adviser name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <div className="space-y-2">
                  {formData.keywords.map((keyword, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => updateKeyword(index, e.target.value)}
                        placeholder="Enter keyword"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    + Add Keyword
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract *
                </label>
                <textarea
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
                  placeholder="Enter project abstract"
                  rows="8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/student/capstone/${id}`)}
                  disabled={submitting}
                  className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
