import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { User } from 'lucide-react'; // Import Lucide User icon

// Exclude fields that should never be edited via this form
const EXCLUDED_FIELDS = [
  '_id', 'gym_id', 'createdAt', 'updatedAt', '__v', 'days_left',
  'subscriptions', 'latest_subscription', // Exclude subscription fields
  'subscription_plan', 'subscription_status', 'upcoming_subscription_plan', 'upcoming_subscription_status',
  'subscription', 'subscriptionId', 'subscription_id', 'id',
  'image' // Exclude 'image' itself from direct payload, as it's handled by file upload
];

export default function EditMemberModal({ isOpen, onClose, member, onSave }) {
  const [form, setForm] = useState(member || {});
  const [memberImage, setMemberImage] = useState(null); // State to hold the new image file
  const [imagePreview, setImagePreview] = useState(null); // State for image preview URL
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && member) {
      setForm(member);
      // Set initial image preview from existing member data
      if (member.image) {
        setImagePreview(`${import.meta.env.VITE_API_BASE_URL}${member.image}`);
      } else {
        setImagePreview(null);
      }
      setMemberImage(null); // Clear any previously selected new image
    }
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMemberImage(file);
      setImagePreview(URL.createObjectURL(file)); // Create a URL for image preview
    } else {
      setMemberImage(null);
      setImagePreview(member.image ? `${import.meta.env.VITE_API_BASE_URL}${member.image}` : null);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    const formData = new FormData(); // Use FormData for file uploads

    // Append all form fields to FormData
    for (const key in form) {
      if (Object.prototype.hasOwnProperty.call(form, key) && !EXCLUDED_FIELDS.includes(key)) {
        let value = form[key];
        // Handle number types if your backend expects them
        if (['height', 'weight', 'age'].includes(key) && value !== null && value !== '') {
          value = Number(value);
        }
        // Handle "Pending start" for start_date if needed (from AddMemberModal logic)
        if (key === 'start_date' && (!value || value === '')) {
          value = 'Pending start';
        }
        formData.append(key, value);
      }
    }

    // Append the new image file if selected
    if (memberImage) {
      formData.append('image', memberImage);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/member/${member._id}`,
        formData, // Send FormData
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data', // Essential for file uploads
          },
        }
      );
      toast.success('Member updated successfully');
      if (onSave) onSave(response.data.member); // Pass the updated member from backend
      onClose();
    } catch (error) {
      toast.error('Error updating member');
      console.error('Error updating member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(member); // Reset form to original member data
    setMemberImage(null); // Clear selected image
    setImagePreview(member.image ? `${import.meta.env.VITE_API_BASE_URL}${member.image}` : null); // Reset image preview
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
          {/* Member Image Section */}
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-md bg-gray-100">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={`${form.name}'s profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                    e.target.className = "w-full h-full object-contain bg-gray-100";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">
                  <span role="img" aria-label="User">👤</span>
                </div>
              )}
            </div>

            <label className="block text-sm font-medium text-gray-700">Change Profile Image:</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150 ease-in-out cursor-pointer"
              disabled={loading}
            />
          </div>

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
                name="name" // Added name attribute
                value={form.name || ""}
                onChange={handleInputChange} // Changed to handleInputChange
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
                  name="roll_no" // Added name attribute
                  value={form.roll_no || ""}
                  onChange={handleInputChange} // Changed to handleInputChange
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
                  name="age" // Added name attribute
                  value={form.age || ""}
                  onChange={handleInputChange} // Changed to handleInputChange
                  className="border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black transition"
                  placeholder="Age"
                  min="1"
                  max="120"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone Number - full width */}
            <div className="mb-4">
              <label className="font-semibold text-start block text-sm sm:text-base">Phone Number:</label>
              <input
                type="text"
                name="phone_number"
                value={form.phone_number || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black transition"
                placeholder="Enter Phone Number"
                disabled={loading}
              />
            </div>

            {/* Dynamic fields from member object */}
            {Object.keys(member).map((key) => {
              // Skip certain fields that shouldn't be edited or are handled explicitly
              if (EXCLUDED_FIELDS.includes(key) || ['name', 'roll_no', 'age', 'phone_number', 'height', 'weight', 'gender', 'address'].includes(key)) {
                return null;
              }

              let value = form[key];
              let type = "text";
              if (key.toLowerCase().includes("date") && value) {
                value = value.slice(0, 10);
                type = "date";
              } else if (typeof value === 'number') {
                type = "number";
              }

              return (
                <div key={key} className="flex flex-col gap-1 mb-4">
                  <label className="font-semibold capitalize text-gray-700 text-sm sm:text-base">
                    {key.replace(/_/g, " ")}:
                  </label>
                  <input
                    type={type}
                    name={key} // Added name attribute
                    value={value || ""}
                    onChange={handleInputChange} // Changed to handleInputChange
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
              <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-800">👤 Personal Details</span>
            </h3>

            {/* Gender - full width */}
            <div className="mb-4">
              <label className="font-semibold text-start block text-sm sm:text-base">Gender:</label>
              <select
                name="gender" // Added name attribute
                value={form.gender || ""}
                onChange={handleInputChange} // Changed to handleInputChange
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
                  name="height" // Added name attribute
                  value={form.height || ""}
                  onChange={handleInputChange} // Changed to handleInputChange
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
                  name="weight" // Added name attribute
                  value={form.weight || ""}
                  onChange={handleInputChange} // Changed to handleInputChange
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
                name="address" // Added name attribute
                value={form.address || ""}
                onChange={handleInputChange} // Changed to handleInputChange
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
            className="bg-black text-white px-6 py-2 rounded flex justify-center items-center font-semibold hover:bg-gray-900 transition cursor-pointer text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed  gap-2"
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
            onClick={handleCancel} // Changed to handleCancel
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