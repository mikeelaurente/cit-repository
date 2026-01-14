import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuth } from '../../AuthContext';

export default function CapstoneProjects() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [capstones, setCapstones] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isRevertModalOpen, setIsRevertModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'manual'
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    authors: [],
    adviser: '',
    keywords: [],
    year: '',
    abstract: '',
    category: '',
    note: '',
  });

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [publishData, setPublishData] = useState({
    id: '',
    title: '',
    keywords: [],
    category: '',
    note: '',
  });

  const [revertData, setRevertData] = useState({
    id: '',
    title: '',
    note: '',
  });

  const [rejectData, setRejectData] = useState({
    id: '',
    title: '',
    note: '',
  });

  useEffect(() => {
    fetchCapstones(1, statusFilter, searchQuery);
  }, []);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchCapstones(1, statusFilter, searchQuery);
    }, 500); // 500ms debounce

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
    fetchCapstones(1, statusFilter, searchQuery);
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
    fetchCapstones(1, statusFilter, searchQuery);
  }, [itemsPerPage]);

  const fetchCapstones = async (page = 1, status = 'all', search = '') => {
    setLoading(true);
    try {
      const response = await apiClient.getAdminCapstones({
        page,
        limit: itemsPerPage,
        status,
        search,
      });

      if (response.status === 'success') {
        setCapstones(response.capstones || []);
        if (response.pagination) {
          setPagination(response.pagination);
          setCurrentPage(response.pagination.page);
        }
      } else {
        showError('Failed to load capstones');
      }
    } catch (err) {
      showError('An error occurred while loading capstones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showError = (message) => {
    setModalMessage(message);
    setShowErrorModal(true);
    setTimeout(() => setShowErrorModal(false), 3000);
  };

  const showSuccess = (message) => {
    setModalMessage(message);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
  };

  const handleOpenUploadModal = () => {
    setUploadMode('file');
    setUploadFile(null);
    setFormData({
      id: '',
      title: '',
      authors: [],
      adviser: '',
      keywords: [],
      year: '',
      abstract: '',
      category: '',
    });
    setIsUploadModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.docx')) {
      setUploadFile(file);
    } else {
      showError('Please select a valid .docx file');
    }
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();

    if (!uploadFile) {
      showError('Please select a file');
      return;
    }

    setFormSubmitting(true);
    try {
      const response = await apiClient.uploadAdminCapstone(uploadFile);

      if (response.status === 'success' || response.status === 'ok') {
        // Show upload summary notification
        const { total_entries, created } = response;
        const message = `${total_entries} capstone${
          total_entries !== 1 ? 's' : ''
        } processed. ${created} new capstone${
          created !== 1 ? 's' : ''
        } created.`;
        showSuccess(message);

        setFormData(
          response.data?.[0] || {
            id: '',
            title: '',
            authors: [],
            adviser: '',
            keywords: [],
            year: '',
            abstract: '',
            category: '',
          }
        );
        setUploadFile(null);

        // Close modal after showing notification
        setTimeout(() => {
          setIsUploadModalOpen(false);
          fetchCapstones();
        }, 500);
      } else {
        showError(response.message || 'Failed to upload file');
      }
    } catch (err) {
      showError('An error occurred while uploading');
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateAuthor = (index, value) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = value;
    setFormData((prev) => ({ ...prev, authors: newAuthors }));
  };

  const removeAuthor = (index) => {
    const newAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, authors: newAuthors }));
  };

  const addAuthor = () => {
    setFormData((prev) => ({ ...prev, authors: [...prev.authors, ''] }));
  };

  const updateKeyword = (index, value) => {
    // Remove commas from keyword input
    const cleanValue = value.replace(/,/g, '');
    const newKeywords = [...formData.keywords];
    newKeywords[index] = cleanValue;
    setFormData((prev) => ({ ...prev, keywords: newKeywords }));
  };

  const removeKeyword = (index) => {
    const newKeywords = formData.keywords.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, keywords: newKeywords }));
  };

  const addKeyword = () => {
    setFormData((prev) => ({ ...prev, keywords: [...prev.keywords, ''] }));
  };

  const handlePublishCapstone = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title) {
      showError('Please enter a title');
      return;
    }
    if (!formData.abstract) {
      showError('Please enter an abstract');
      return;
    }
    if (!formData.year) {
      showError('Please enter a year');
      return;
    }
    if (
      formData.authors.length === 0 ||
      formData.authors.some((a) => !a.trim())
    ) {
      showError('Please enter at least one author');
      return;
    }
    if (
      formData.keywords.length === 0 ||
      formData.keywords.some((k) => !k.trim())
    ) {
      showError('Please enter at least one keyword');
      return;
    }
    if (!formData.category) {
      showError('Please select a category');
      return;
    }

    setFormSubmitting(true);
    setProcessingProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Filter out empty authors and keywords
      const payload = {
        title: formData.title,
        authors: formData.authors.filter((a) => a.trim()),
        keywords: formData.keywords.filter((k) => k.trim()),
        year: formData.year,
        abstract: formData.abstract,
        adviser: formData.adviser || null,
        category: formData.category,
      };

      let response;
      if (isEditMode) {
        response = await apiClient.editCapstone(formData.id, payload);
      } else if (formData.id) {
        // File upload - use publishCapstone with keywords, category, and note
        response = await apiClient.publishCapstone(formData.id, {
          keywords: formData.keywords.filter((k) => k.trim()),
          category: formData.category,
          note: formData.note || '',
        });
      } else {
        // Manual entry - use new endpoint
        response = await apiClient.createAdminCapstone(payload);
      }

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (response.status === 'ok' || response.status === 'success') {
        showSuccess(
          isEditMode
            ? 'Capstone updated successfully!'
            : 'Capstone approved successfully!'
        );
        setIsUploadModalOpen(false);
        setIsModalOpen(false);
        fetchCapstones();
      } else {
        showError(response.message || 'Failed to process capstone');
      }
    } catch (err) {
      showError(
        err.response?.data?.detail || 'An error occurred while processing'
      );
      console.error(err);
    } finally {
      setFormSubmitting(false);
      setProcessingProgress(0);
    }
  };

  const handleEditCapstone = (capstone) => {
    setIsEditMode(true);
    setFormData({
      id: capstone.id,
      title: capstone.title || '',
      authors: Array.isArray(capstone.authors) ? capstone.authors : [],
      adviser: capstone.adviser || '',
      keywords: Array.isArray(capstone.keywords) ? capstone.keywords : [],
      year: capstone.year || '',
      abstract: capstone.abstract || '',
      category: capstone.category || '',
      note: capstone.note || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenPublishModal = (capstone) => {
    setPublishData({
      id: capstone.id,
      title: capstone.title || '',
      keywords: Array.isArray(capstone.keywords) ? capstone.keywords : [],
      category: capstone.category || '',
      note: '',
    });
    setIsPublishModalOpen(true);
  };

  const updatePublishKeyword = (index, value) => {
    const updatedKeywords = [...publishData.keywords];
    updatedKeywords[index] = value;
    setPublishData({ ...publishData, keywords: updatedKeywords });
  };

  const addPublishKeyword = () => {
    setPublishData({
      ...publishData,
      keywords: [...publishData.keywords, ''],
    });
  };

  const removePublishKeyword = (index) => {
    const updatedKeywords = publishData.keywords.filter((_, i) => i !== index);
    setPublishData({ ...publishData, keywords: updatedKeywords });
  };

  const handlePublishFormChange = (e) => {
    const { name, value } = e.target;
    setPublishData({ ...publishData, [name]: value });
  };

  const handleSubmitPublish = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      publishData.keywords.length === 0 ||
      publishData.keywords.some((k) => !k.trim())
    ) {
      showError('Please enter at least one keyword');
      return;
    }
    if (!publishData.category) {
      showError('Please select a category');
      return;
    }

    setFormSubmitting(true);
    setProcessingProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await apiClient.publishCapstone(publishData.id, {
        keywords: publishData.keywords.filter((k) => k.trim()),
        category: publishData.category,
        note: publishData.note || '',
      });

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (response.status === 'ok' || response.status === 'success') {
        showSuccess('Capstone approved successfully!');
        setIsPublishModalOpen(false);
        fetchCapstones(1, statusFilter, searchQuery);
      } else {
        showError(response.message || 'Failed to publish capstone');
      }
    } catch (err) {
      showError(
        err.response?.data?.detail || 'An error occurred while publishing'
      );
      console.error(err);
    } finally {
      setFormSubmitting(false);
      setProcessingProgress(0);
    }
  };

  const handleOpenRevertModal = (capstone) => {
    setRevertData({
      id: capstone.id,
      title: capstone.title || '',
      note: '',
    });
    setIsRevertModalOpen(true);
  };

  const handleRevertFormChange = (e) => {
    const { name, value } = e.target;
    setRevertData({ ...revertData, [name]: value });
  };

  const handleSubmitRevert = async (e) => {
    e.preventDefault();

    setFormSubmitting(true);
    setProcessingProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await apiClient.revertCapstontoPending(
        revertData.id,
        revertData.note
      );

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (response.status === 'ok' || response.status === 'success') {
        showSuccess('Capstone reverted to pending successfully!');
        setIsRevertModalOpen(false);
        fetchCapstones(1, statusFilter, searchQuery);
      } else {
        showError(response.message || 'Failed to revert capstone');
      }
    } catch (err) {
      showError(
        err.response?.data?.detail || 'An error occurred while reverting'
      );
      console.error(err);
    } finally {
      setFormSubmitting(false);
      setProcessingProgress(0);
    }
  };

  const handleOpenRejectModal = (capstone) => {
    setRejectData({
      id: capstone.id,
      title: capstone.title || '',
      note: '',
    });
    setIsRejectModalOpen(true);
  };

  const handleRejectFormChange = (e) => {
    const { name, value } = e.target;
    setRejectData({ ...rejectData, [name]: value });
  };

  const handleSubmitReject = async (e) => {
    e.preventDefault();

    setFormSubmitting(true);
    setProcessingProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await apiClient.rejectCapstone(
        rejectData.id,
        rejectData.note
      );

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (response.status === 'ok' || response.status === 'success') {
        showSuccess('Capstone rejected successfully!');
        setIsRejectModalOpen(false);
        fetchCapstones(1, statusFilter, searchQuery);
      } else {
        showError(response.message || 'Failed to reject capstone');
      }
    } catch (err) {
      showError(
        err.response?.data?.detail || 'An error occurred while rejecting'
      );
      console.error(err);
    } finally {
      setFormSubmitting(false);
      setProcessingProgress(0);
    }
  };

  const handleDeleteClick = (capstone) => {
    setDeleteItem(capstone);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    setFormSubmitting(true);
    try {
      const response = await apiClient.deleteCapstone(deleteItem.id);
      if (response.status === 'ok' || response.status === 'success') {
        showSuccess(response.message || 'Capstone deleted successfully!');
        setIsDeleteModalOpen(false);
        setDeleteItem(null);
        fetchCapstones(1, statusFilter, searchQuery);
      } else {
        showError(response.message || 'Failed to delete capstone');
      }
    } catch (err) {
      showError('An error occurred while deleting');
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const paginatedCapstones = capstones;
  const totalPages = pagination.total_pages;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-20 bg-purple-900 flex flex-col items-center py-6 gap-6 h-screen fixed left-0 top-0 overflow-hidden">
        {/* Dashboard Icon */}
        <div
          onClick={() => navigate('/admin')}
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
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </div>

        {/* Document Icon - Active */}
        <div className="w-8 h-8 flex items-center justify-center text-white cursor-pointer bg-purple-800 rounded-lg transition-colors">
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
      <main className="flex-1 ml-20 p-8">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Capstone Projects
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and publish capstone submissions
            </p>
          </div>

          {showErrorModal && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {modalMessage}
            </div>
          )}

          {showSuccessModal && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {modalMessage}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
              <div className="flex gap-4 items-center flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-400 transition"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search capstones..."
                    className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-400 transition"
                  />
                </div>
              </div>

              <button
                onClick={handleOpenUploadModal}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-md"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Capstone
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Authors
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Year
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Loading capstones...
                      </td>
                    </tr>
                  ) : paginatedCapstones.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No capstones found
                      </td>
                    </tr>
                  ) : (
                    paginatedCapstones.map((capstone) => (
                      <tr
                        key={capstone.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">
                          {capstone.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {Array.isArray(capstone.authors)
                            ? capstone.authors.join(', ')
                            : capstone.authors}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {capstone.year}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              capstone.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : capstone.status === 'approved' ||
                                  capstone.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : capstone.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {capstone.status.charAt(0).toUpperCase() +
                              capstone.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="relative group">
                            <button className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                              Actions
                              <svg
                                className="w-4 h-4 ml-1"
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
                            <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              {capstone.status?.toLowerCase() === 'pending' && (
                                <button
                                  onClick={() =>
                                    handleOpenPublishModal(capstone)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 first:rounded-t-lg"
                                >
                                  ✓ Approve
                                </button>
                              )}
                              {capstone.status?.toLowerCase() !== 'pending' && (
                                <button
                                  onClick={() =>
                                    handleOpenRevertModal(capstone)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-orange-50"
                                >
                                  ↺ Revert to Pending
                                </button>
                              )}
                              {capstone.status?.toLowerCase() !==
                                'rejected' && (
                                <button
                                  onClick={() =>
                                    handleOpenRejectModal(capstone)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                >
                                  ✕ Reject
                                </button>
                              )}
                              <button
                                onClick={() => handleEditCapstone(capstone)}
                                className="block w-full text-left px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50"
                              >
                                ✎ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(capstone)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 last:rounded-b-lg border-t border-gray-200"
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="itemsPerPage"
                      className="text-sm text-gray-600"
                    >
                      Items per page:
                    </label>
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (pagination.has_prev) {
                        fetchCapstones(
                          currentPage - 1,
                          statusFilter,
                          searchQuery
                        );
                      }
                    }}
                    disabled={!pagination.has_prev}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      if (pagination.has_next) {
                        fetchCapstones(
                          currentPage + 1,
                          statusFilter,
                          searchQuery
                        );
                      }
                    }}
                    disabled={!pagination.has_next}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upload Modal */}
          {isUploadModalOpen && uploadMode === 'file' && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Upload Capstone
                </h2>

                <form onSubmit={handleUploadFile} className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept=".docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="fileInput"
                    />
                    <label
                      htmlFor="fileInput"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">
                        {uploadFile ? uploadFile.name : 'Click to select file'}
                      </span>
                      <span className="text-xs text-gray-500">
                        (.docx only)
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMode('manual');
                        setIsEditMode(false);
                      }}
                      className="flex-1 px-4 py-2 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium"
                    >
                      Manual Entry
                    </button>
                    <button
                      type="submit"
                      disabled={!uploadFile || formSubmitting}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
                    >
                      {formSubmitting ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit/Verify Modal */}
          {(isModalOpen || (isUploadModalOpen && uploadMode === 'manual')) && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 my-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {isEditMode ? 'Edit Capstone' : 'Create Capstone'}
                </h2>

                {processingProgress > 0 && processingProgress < 100 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        Processing capstone...
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {processingProgress}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <form onSubmit={handlePublishCapstone} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Authors
                    </label>
                    <div className="space-y-2">
                      {Array.isArray(formData.authors) &&
                        formData.authors.map((author, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={author}
                              onChange={(e) =>
                                updateAuthor(index, e.target.value)
                              }
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder={`Author ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeAuthor(index)}
                              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      <button
                        type="button"
                        onClick={addAuthor}
                        className="w-full px-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                      >
                        + Add Author
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adviser
                      </label>
                      <input
                        type="text"
                        name="adviser"
                        value={formData.adviser}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year
                      </label>
                      <input
                        type="text"
                        name="year"
                        value={formData.year}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords
                    </label>
                    <div className="space-y-2">
                      {Array.isArray(formData.keywords) &&
                        formData.keywords.map((keyword, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={keyword}
                              onChange={(e) =>
                                updateKeyword(index, e.target.value)
                              }
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder={`Keyword ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeKeyword(index)}
                              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      <button
                        type="button"
                        onClick={addKeyword}
                        className="w-full px-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                      >
                        + Add Keyword
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="AI">Artificial Intelligence</option>
                      <option value="Web">Web Development</option>
                      <option value="Mobile">Mobile Development</option>
                      <option value="Security">Security</option>
                      <option value="Database">Database</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="2"
                      placeholder="Add any additional notes or comments"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Abstract
                    </label>
                    <textarea
                      name="abstract"
                      value={formData.abstract}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="4"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsUploadModalOpen(false);
                        setUploadMode('file');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
                    >
                      {formSubmitting
                        ? 'Processing...'
                        : isEditMode
                        ? 'Update'
                        : 'Publish'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && deleteItem && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Delete Capstone
                </h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{deleteItem.title}"? This
                  action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={formSubmitting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                  >
                    {formSubmitting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Publish Modal */}
          {isPublishModalOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Approve Capstone
                </h2>
                <p className="text-gray-600 mb-6">{publishData.title}</p>

                {showSuccessModal && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">{modalMessage}</p>
                  </div>
                )}
                {showErrorModal && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{modalMessage}</p>
                  </div>
                )}

                {processingProgress > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Approving...
                      </span>
                      <p className="text-sm font-medium text-gray-700">
                        {processingProgress}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitPublish} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords
                    </label>
                    <div className="space-y-2">
                      {Array.isArray(publishData.keywords) &&
                        publishData.keywords.map((keyword, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={keyword}
                              onChange={(e) =>
                                updatePublishKeyword(index, e.target.value)
                              }
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder={`Keyword ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removePublishKeyword(index)}
                              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      <button
                        type="button"
                        onClick={addPublishKeyword}
                        className="w-full px-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                      >
                        + Add Keyword
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={publishData.category}
                      onChange={handlePublishFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="AI">Artificial Intelligence</option>
                      <option value="Web">Web Development</option>
                      <option value="Mobile">Mobile Development</option>
                      <option value="Security">Security</option>
                      <option value="Database">Database</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note (Optional)
                    </label>
                    <textarea
                      name="note"
                      value={publishData.note}
                      onChange={handlePublishFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="3"
                      placeholder="Add any additional notes or comments"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPublishModalOpen(false);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
                    >
                      {formSubmitting ? 'Approving...' : 'Approve'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Revert Modal */}
          {isRevertModalOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Revert to Pending
                </h2>
                <p className="text-gray-600 mb-6">{revertData.title}</p>

                {showSuccessModal && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">{modalMessage}</p>
                  </div>
                )}
                {showErrorModal && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{modalMessage}</p>
                  </div>
                )}

                {processingProgress > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Reverting...
                      </span>
                      <p className="text-sm font-medium text-gray-700">
                        {processingProgress}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitRevert} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note (Optional)
                    </label>
                    <textarea
                      name="note"
                      value={revertData.note}
                      onChange={handleRevertFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="4"
                      placeholder="Add reason for reverting to pending status"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRevertModalOpen(false);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50"
                    >
                      {formSubmitting ? 'Reverting...' : 'Revert to Pending'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isRejectModalOpen && (
            <div className="fixed inset-0 z-50 bg-gray-600/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Reject Capstone
                </h2>
                <p className="text-gray-600 mb-6">{rejectData.title}</p>

                {showSuccessModal && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">{modalMessage}</p>
                  </div>
                )}
                {showErrorModal && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{modalMessage}</p>
                  </div>
                )}

                {processingProgress > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Rejecting...
                      </span>
                      <p className="text-sm font-medium text-gray-700">
                        {processingProgress}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitReject} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Rejection (Optional)
                    </label>
                    <textarea
                      name="note"
                      value={rejectData.note}
                      onChange={handleRejectFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="4"
                      placeholder="Provide feedback on why this capstone is being rejected"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRejectModalOpen(false);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                    >
                      {formSubmitting ? 'Rejecting...' : 'Reject Capstone'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
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
    </div>
  );
}
