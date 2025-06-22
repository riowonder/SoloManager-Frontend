import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Only exclude fields that should never be edited
const EXCLUDED_FIELDS = [
  '_id', 'gym_id', 'createdAt', 'updatedAt', '__v', 'days_left',
  'subscriptions', 'latest_subscription', // Exclude subscription fields
  'subscription_plan', 'subscription_status', 'upcoming_subscription_plan', 'upcoming_subscription_status',
  'subscription', 'subscriptionId', 'subscription_id', 'id'
];

export default function EditMemberModal({ isOpen, onClose, member, onSave }) {
  const [form, setForm] = useState(member || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && member) setForm(member);
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  const handleInputChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Remove excluded fields from payload
    const payload = { ...form };
    EXCLUDED_FIELDS.forEach(f => delete payload[f]);
    // If start_date is empty, send 'Pending start'
    if ('start_date' in payload && (!payload.start_date || payload.start_date === '')) {
      payload.start_date = 'Pending start';
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/member/${member._id}`,
        payload,
        { withCredentials: true }
      );
      toast.success('Member updated successfully');
      if (onSave) onSave(response.data.member || payload);
      onClose();
    } catch (error) {
      toast.error('Error updating member');
      console.error('Error updating member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(member);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md relative flex flex-col max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-black transition cursor-pointer"
          onClick={onClose}
          disabled={loading}
        >
          &times;
        </button>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 mt-8 text-center tracking-tight text-gray-900">Edit Member</h2>
        <form
          className="flex-1 flex flex-col gap-4 px-4 sm:px-8 py-4 overflow-y-auto custom-scrollbar"
          style={{ minHeight: 0, maxHeight: 'calc(70vh - 64px)' }}
          onSubmit={e => e.preventDefault()}
        >
          {/* Basic Information Section */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-start block text-sm sm:text-base mb-3 text-gray-700 border-b border-gray-200 pb-2">
              <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-800">📋 Basic Information</span>
            </h3>
            
            {/* Name field - always at top */}
            <div className="flex flex-col gap-1 mb-4">
              <label className="font-semibold capitalize text-gray-700 text-sm sm:text-base text-start">
                Name:
              </label>
              <input
                type="text"
                value={form.name || ""}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black transition"
                placeholder="Enter name"
                disabled={loading}
              />
            </div>

            {/* Roll No and Age side by side */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold capitalize text-gray-700 text-sm sm:text-base text-start">
                  Roll No:
                </label>
                <input
                  type="text"
                  value={form.roll_no || ""}
                  onChange={(e) => handleInputChange('roll_no', e.target.value)}
                  className="border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black transition"
                  placeholder="Enter roll no"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold capitalize text-gray-700 text-sm sm:text-base text-start">
                  Age:
                </label>
                <input
                  type="number"
                  value={form.age || ""}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black transition"
                  placeholder="Age"
                  min="1"
                  max="120"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Other basic fields */}
            {Object.keys(member).map((key) => {
              // Skip certain fields that shouldn't be edited
              if (key === '_id' || key === '__v' || key === 'createdAt' || key === 'updatedAt' || key === 'gym_id' || key === 'subscriptions') {
                return null;
              }

              // Skip fields already handled above and personal details
              if (['name', 'roll_no', 'age', 'height', 'weight', 'gender', 'address', 'phone_number'].includes(key)) {
                return null;
              }

              let value = form[key];
              if (key.toLowerCase().includes("date") && value) {
                value = value.slice(0, 10);
              }

              return (
                <div key={key} className="flex flex-col gap-1 mb-4">
                  <label className="font-semibold capitalize text-gray-700 text-sm sm:text-base">
                    {key.replace(/_/g, " ")}:
                  </label>
                  <input
                    type={key.toLowerCase().includes("date") ? "date" : "text"}
                    value={value || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black transition"
                    placeholder={`Enter ${key.replace(/_/g, " ")}`}
                    disabled={loading}
                  />
                </div>
              );
            })}
          </div>

          {/* Personal Details Section */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-start block text-sm sm:text-base mb-3 text-gray-700 border-b border-gray-200 pb-2">
              <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-800">📋 Personal Details</span>
            </h3>
            
            {/* Phone Number - full width */}
            <div className="mb-4">
              <label className="font-semibold text-start block text-sm sm:text-base">Phone Number:</label>
              <input
                type="text"
                value={form.phone_number || ""}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black transition"
                placeholder="Enter Phone Number"
                disabled={loading}
              />
            </div>

            {/* Gender - full width */}
            <div className="mb-4">
              <label className="font-semibold text-start block text-sm sm:text-base">Gender:</label>
              <select
                value={form.gender || ""}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black transition"
                disabled={loading}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Height and Weight side by side */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-semibold text-start block text-sm sm:text-base">Height (cm):</label>
                <input
                  type="number"
                  value={form.height || ""}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black transition"
                  placeholder="Height in cm"
                  min="50"
                  max="300"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="font-semibold text-start block text-sm sm:text-base">Weight (kg):</label>
                <input
                  type="number"
                  value={form.weight || ""}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black transition"
                  placeholder="Weight in kg"
                  min="10"
                  max="500"
                  step="0.1"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Address - full width */}
            <div className="mt-4">
              <label className="font-semibold text-start block text-sm sm:text-base">Address:</label>
              <textarea
                value={form.address || ""}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black transition"
                placeholder="Enter address"
                rows="3"
                disabled={loading}
              />
            </div>
          </div>
        </form>
        <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-8 justify-end">
          
          <button
            type="button"
            className="bg-black text-white px-6 py-2 rounded flex justify-center items-center font-semibold hover:bg-gray-900 transition cursor-pointer text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>

          <button
            type="button"
            className="bg-gray-100 text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition cursor-pointer text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
        <style>
          {`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #e5e7eb;
              border-radius: 4px;
            }
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #e5e7eb #fff;
            }
          `}
        </style>
      </div>
    </div>
  );
} 