import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [isSorted, setIsSorted] = useState(false);
  const requestsPerPage = 5;

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Fetch all requests
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_URL}/requests`, {
        timeout: 10000
      });
      // Handle both array response and object with requests property
      const requestsData = Array.isArray(res.data) ? res.data : (res.data.requests || []);
      setRequests(requestsData);
      setFilteredRequests(requestsData);
      
      // If there's an error message but data exists, show warning
      if (res.data.error && requestsData.length === 0) {
        setError(res.data.message || res.data.error);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      let errorMessage = 'Failed to fetch requests.';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check if the backend is running.';
      } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        errorMessage = `Cannot connect to backend at ${API_URL}. Make sure the server is running.`;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.message || err.response.data.error;
      } else if (err.response?.data) {
        // Handle case where backend returns error but with data
        const requestsData = err.response.data.requests || [];
        setRequests(requestsData);
        setFilteredRequests(requestsData);
        errorMessage = err.response.data.message || err.response.data.error;
      }
      
      setError(errorMessage);
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch sorted requests
  const fetchSortedRequests = useCallback(async (order) => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_URL}/requests/sorted?order=${order}`);
      setRequests(res.data);
      setFilteredRequests(res.data);
      setIsSorted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch sorted requests.');
      console.error('Error fetching sorted requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search requests
  const searchRequests = useCallback(async (term) => {
    if (!term.trim()) {
      fetchRequests();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API_URL}/requests/search?title=${encodeURIComponent(term)}`);
      setFilteredRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed.');
      console.error('Error searching requests:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchRequests]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term) => {
      searchRequests(term);
    }, 300),
    [searchRequests]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    debouncedSearch(value);
  };

  // Handle sort toggle
  const handleSortToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    fetchSortedRequests(newOrder);
    setCurrentPage(1);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    setIsSorted(false);
    fetchRequests();
  };

  // Delete request
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/request/${id}`);
      // Refresh requests
      if (searchTerm) {
        searchRequests(searchTerm);
      } else if (isSorted) {
        fetchSortedRequests(sortOrder);
      } else {
        fetchRequests();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete request.');
      alert('Failed to delete request. Please try again.');
    }
  };

  // Check if request is recent (within last 1 hour)
  const isRecentRequest = (timestamp) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return new Date(timestamp) > oneHourAgo;
  };

  // Calculate statistics
  const getStatistics = () => {
    const totalRequests = requests.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRequests = requests.filter(
      (r) => new Date(r.timestamp) >= today
    ).length;

    // Count duplicate titles
    const titleCounts = {};
    requests.forEach((r) => {
      titleCounts[r.title] = (titleCounts[r.title] || 0) + 1;
    });
    const duplicateTitles = Object.entries(titleCounts)
      .filter(([_, count]) => count > 1)
      .map(([title, count]) => ({ title, count }));

    return { totalRequests, todayRequests, duplicateTitles };
  };

  // Pagination
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  // Socket.IO for real-time updates
  useEffect(() => {
    const socket = io(API_URL);

    socket.on('connect', () => {
      console.log('Connected to server via Socket.IO');
    });

    socket.on('newRequest', (newRequest) => {
      setRequests(prev => [newRequest, ...prev]);
      // Update filtered requests if not searching/sorting
      if (!searchTerm && !isSorted) {
        setFilteredRequests(prev => [newRequest, ...prev]);
      }
    });

    socket.on('requestDeleted', (deletedId) => {
      setRequests(prev => prev.filter(r => r._id !== deletedId));
      setFilteredRequests(prev => prev.filter(r => r._id !== deletedId));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, [API_URL, searchTerm, isSorted]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const stats = getStatistics();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Request Management Dashboard</h1>
        <p className="subtitle">EDUZAP L LP</p>
      </div>

      {/* Statistics Widget */}
      <div className="stats-widget">
        <div className="stat-card">
          <div className="stat-value">{stats.totalRequests}</div>
          <div className="stat-label">Total Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.todayRequests}</div>
          <div className="stat-label">Today's Requests</div>
        </div>
        {stats.duplicateTitles.length > 0 && (
          <div className="stat-card">
            <div className="stat-value">{stats.duplicateTitles.length}</div>
            <div className="stat-label">Duplicate Titles</div>
          </div>
        )}
      </div>

      {/* Request Title Statistics */}
      {stats.duplicateTitles.length > 0 && (
        <div className="title-stats">
          <h3>Request Title Statistics</h3>
          <div className="title-stats-list">
            {stats.duplicateTitles.map(({ title, count }) => (
              <div key={title} className="title-stat-item">
                <span className="title-stat-name">{title}:</span>
                <span className="title-stat-count">{count} requests</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={handleClearSearch} className="clear-button">
              Clear
            </button>
          )}
        </div>
        <div className="sort-container">
          <button onClick={handleSortToggle} className="sort-button">
            Sort {sortOrder === 'asc' ? 'Z-A' : 'A-Z'}
          </button>
          {isSorted && (
            <button onClick={handleClearSearch} className="clear-button">
              Show All
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading requests...</p>
        </div>
      )}

      {/* Requests Table */}
      {!loading && (
        <>
          {filteredRequests.length === 0 ? (
            <div className="no-requests">
              <p>No requests found.</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone Number</th>
                      <th>Request Title</th>
                      <th>Image</th>
                      <th>Timestamp</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRequests.map((r) => (
                      <tr
                        key={r._id}
                        className={isRecentRequest(r.timestamp) ? 'recent-request' : ''}
                      >
                        <td>{r.name}</td>
                        <td>{r.phone}</td>
                        <td>{r.title}</td>
                        <td>
                          {r.image ? (
                            <img
                              src={r.image}
                              alt={r.title}
                              className="request-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          ) : (
                            <span className="no-image">No Image</span>
                          )}
                          {r.image && <span className="no-image" style={{ display: 'none' }}>No Image</span>}
                        </td>
                        <td>{new Date(r.timestamp).toLocaleString()}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="page-button"
                  >
                    Previous
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="page-button"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
