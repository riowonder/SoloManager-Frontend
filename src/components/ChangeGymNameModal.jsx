import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUser } from '../context/UserContext';

const ChangeGymNameModal = ({ isOpen, onClose, currentGymName }) => {
  const [gymName, setGymName] = useState(currentGymName || '');
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gymName.trim()) {
      toast.error('Gym name cannot be empty');
      return;
    }

    if (gymName.trim() === currentGymName) {
      toast.error('New gym name must be different from current name');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/update-gym-name`,
        { gym_name: gymName.trim() },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Gym name updated successfully!');
        // Update the user context with new gym name
        if (updateUser) {
          updateUser({ ...user, gym_name: gymName.trim() });
        }
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to update gym name');
      }
    } catch (error) {
      console.error('Error updating gym name:', error);
      toast.error(error.response?.data?.message || 'Failed to update gym name');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setGymName(currentGymName || '');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 bg-opacity-50 z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Change Gym Name</h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label htmlFor="gymName" className="block text-sm font-medium text-gray-700 mb-2">
                Current Gym Name
              </label>
              <input
                type="text"
                value={currentGymName || 'No gym name set'}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="newGymName" className="block text-sm font-medium text-gray-700 mb-2">
                New Gym Name
              </label>
              <input
                type="text"
                id="newGymName"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                placeholder="Enter new gym name"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                maxLength={50}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !gymName.trim() || gymName.trim() === currentGymName}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Gym Name'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangeGymNameModal; 