import React, { useState } from 'react';
import axios from 'axios';

const NewFieldModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fieldName: '',
    fieldType: 'String'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/dashboard/add-field`,
        {
          fieldName: formData.fieldName,
          fieldType: formData.fieldType
        },
        { withCredentials: true }
      );
      setFormData({ fieldName: '', fieldType: 'String' });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
        console.log(err);
      setError(err.response?.data?.message || 'Failed to add field');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
    className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Add New Field</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
              New Field Name
            </label>
            <input
              type="text"
              name="fieldName"
              value={formData.fieldName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter field name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
              New Field Type
            </label>
            <select
              name="fieldType"
              value={formData.fieldType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="String">Text</option>
              <option value="Number">Number</option>
              <option value="Date">Date</option>
              <option value="Boolean">Boolean</option>
            </select>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Field'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFieldModal;
