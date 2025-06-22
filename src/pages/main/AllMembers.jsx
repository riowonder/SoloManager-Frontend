import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShowMemberModal from '../../components/ShowMemberModal';
import AddMemberModal from '../../components/AddMemberModal';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function AllMembers() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user?.email) {
      if (searchQuery.trim()) {
        // Use search API when there's a search query
        searchMembers();
      } else {
        // Use regular get-members API when no search query
        fetchMembers(currentPage);
      }
    }
  }, [currentPage, user, statusFilter, searchQuery]);

  const fetchMembers = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/member/get-members?page=${page}&limit=10&filter=${statusFilter}`, { withCredentials: true });
      setMembers(response.data.members);
      setTotalPages(response.data.totalPages);
      setTotalMembers(response.data.totalMembers);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchMembers = async () => {
    try {
      setIsSearching(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/member/search?q=${encodeURIComponent(searchQuery)}&filter=${statusFilter}`, { withCredentials: true });
      setMembers(response.data.members);
      setTotalMembers(response.data.totalMembers);
      setTotalPages(1); // Search results are not paginated
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching members:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleStatusFilterChange = (newFilter) => {
    setStatusFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSaveMember = (updatedMember) => {
    if (user?.email) {
      if (searchQuery.trim()) {
        searchMembers(); // Refetch search results
      } else {
        fetchMembers(currentPage); // Refetch current page
      }
    }
  };

  const handleAddMemberSuccess = () => {
    if (searchQuery.trim()) {
      searchMembers(); // Refetch search results
    } else {
      fetchMembers(currentPage); // Refetch current page
    }
  };

  // Helper function to format days left display
  const formatDaysLeft = (daysLeft) => {
    if (typeof daysLeft === 'string') {
      // If it's already a status string, return as is
      return daysLeft;
    }
    // If it's a number, format with "left"
    if (typeof daysLeft === 'number') {
      return `${daysLeft} ${daysLeft === 1 ? "Day" : "Days"} left`;
    }
    // Fallback
    return "N/A";
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-2 sm:p-6 overflow-x-hidden">
        <div className="max-w-full">
          {/* Add Member Modal */}
          <AddMemberModal isOpen={showAddMember} onClose={() => setShowAddMember(false)} onSuccess={handleAddMemberSuccess} />

          {/* Back Button and Total Members */}
          <div className="flex flex sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold px-2 sm:px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition cursor-pointer"
              onClick={() => navigate(user?.role === 'manager' ? '/manager/dashboard' : '/admin/dashboard')}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>

            <div className="text-sm sm:text-lg font-semibold text-green-800 bg-green-100 px-2 sm:px-4 py-2 rounded-lg border-2 border-green-300 shadow-md">
              Total Members: <span className="font-bold text-green-900">{totalMembers}</span>
            </div>
          </div>

          {/* Page Title */}
          <div className="flex justify-center items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-montserrat">All Members</h2>
          </div>

          {/* Filter and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="px-2 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="all">All Members</option>
                <option value="active" className="text-green-600">Active Members</option>
                <option value="inactive" className="text-red-600">Inactive Members</option>
              </select>
              <button
                onClick={() => setShowAddMember(true)}
                className="bg-black text-white px-2 sm:px-4 py-2 rounded-md font-semibold hover:bg-gray-900 transition cursor-pointer text-sm sm:text-base"
              >
                <span className="hidden sm:inline">+ Add Member</span>
                <span className="sm:hidden">+Add</span>
              </button>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name, roll no, phone, gender, or address..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-2 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base flex-1"
              />
              <button
                onClick={searchMembers}
                disabled={!searchQuery.trim() || isSearching}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer text-sm sm:text-base"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
              {searchQuery.trim() && (
                <button
                  onClick={clearSearch}
                  className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition cursor-pointer text-sm sm:text-base"
                >
                  X
                </button>
              )}
            </div>
          </div>

          {/* Loading Spinner */}
          {(loading || isSearching) && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">
                {isSearching ? 'Searching...' : 'Loading data...'}
              </p>
            </div>
          )}

          {/* Members Table */}
          {!loading && !isSearching && (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {members.map((member) => (
                        <tr key={member._id} className="hover:bg-gray-50">
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-900 font-medium text-sm sm:text-base break-words">{member.name}</td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-700 text-sm sm:text-base break-words">{member.subscriptions[0]?.plan || 'N/A'}</td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-700 text-sm sm:text-base break-words">
                            {formatDaysLeft(member.days_left)}
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-700 text-sm sm:text-base break-words">{member.phone_number || 'N/A'}</td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-sm font-medium">
                            <button
                              onClick={() => handleSelectMember(member)}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer text-xs sm:text-sm"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {members.map((member) => (
                  <div key={member._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                      <button
                        onClick={() => handleSelectMember(member)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Plan:</span>
                        <span className="font-medium">{member.subscriptions[0]?.plan || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Days Left:</span>
                        <span className="font-medium">{formatDaysLeft(member.days_left)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="font-medium">{member.phone_number || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search Results Info */}
              {searchQuery.trim() && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Found {totalMembers} member{totalMembers !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                </div>
              )}

              {/* No Results Message */}
              {searchQuery.trim() && totalMembers === 0 && (
                <div className="text-center py-8">
                  <p className="text-lg text-gray-600 mb-2">No members found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-500">Try searching with different keywords or check your spelling.</p>
                </div>
              )}

              {/* Pagination - Only show for non-search results */}
              {!searchQuery.trim() && (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalMembers)} of {totalMembers} members
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-2 sm:px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer text-xs sm:text-sm"
                    >
                      Previous
                    </button>
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-2 sm:px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer text-xs sm:text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Member Details Modal */}
          <ShowMemberModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            member={selectedMember}
            onSave={handleSaveMember}
          />
        </div>
      </div>
    </div>
  );
} 