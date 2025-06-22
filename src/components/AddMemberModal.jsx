import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const plans = [
  '1 Month',
  '3 Months',
  '6 Months',
  '1 Year',
  'Custom' 
];

export default function AddMemberModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    roll_no: '',
    name: '',
    phone_number: '',
    subscription_plan: 'Custom',
    extra_days: '',
    amount: '',
    start_date: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // First, create the member
      const memberResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/member/add`, {
        roll_no: form.roll_no,
        name: form.name,
        phone_number: form.phone_number,
        height: form.height,
        weight: form.weight,
        age: form.age,
        gender: form.gender,
        address: form.address
      }, { withCredentials: true });

      if (memberResponse.data.success) {
        const member = memberResponse.data.member;
        
        // Then, add the subscription for the newly created member
        if (form.start_date && form.subscription_plan) {
          try {
            const subscriptionResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/member/${member._id}/subscription`, {
              plan: form.subscription_plan,
              amount: Number(form.amount) || 0,
              extra_days: form.extra_days ? Number(form.extra_days) : 0,
              start_date: form.start_date,
              status: 'Active'
            }, { withCredentials: true });

            if (subscriptionResponse.data.success) {
              toast.success("Member and subscription added successfully!");
            } else {
              toast.success("Member added successfully, but subscription failed!");
            }
          } catch (subscriptionError) {
            toast.success("Member added successfully, but subscription failed!");
            console.error("Subscription error:", subscriptionError);
          }
        } else {
          toast.success("Member added successfully!");
        }
        
        onSuccess();
        onClose();
        // Reset form
        setForm({
          roll_no: '',
          name: '',
          phone_number: '',
          subscription_plan: 'Custom',
          extra_days: '',
          amount: '',
          start_date: '',
          height: '',
          weight: '',
          age: '',
          gender: '',
          address: ''
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-black cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Add New Member</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-semibold text-start block text-sm sm:text-base">Roll No.:</label>
            <input
              type="text"
              name="roll_no"
              value={form.roll_no}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base"
              placeholder="Enter Roll No."
              required
            />
          </div>
          <div>
            <label className="font-semibold text-start block text-sm sm:text-base">Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base"
              placeholder="Enter Member Name"
              required
            />
          </div>
          <div>
            <label className="font-semibold text-start block text-sm sm:text-base">Phone Number:</label>
            <input
              type="text"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base"
              placeholder="Enter Phone Number"
            />
          </div>
          
          {/* New Personal Details Section */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-start block text-sm sm:text-base mb-3 text-gray-700">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-start block text-sm sm:text-base">Age:</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base"
                  placeholder="Age"
                  min="1"
                  max="120"
                />
              </div>
              <div>
                <label className="font-semibold text-start block text-sm sm:text-base">Gender:</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-start block text-sm sm:text-base">Height (cm):</label>
                <input
                  type="number"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base"
                  placeholder="Height in cm"
                  min="50"
                  max="300"
                />
              </div>
              <div>
                <label className="font-semibold text-start block text-sm sm:text-base">Weight (kg):</label>
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base"
                  placeholder="Weight in kg"
                  min="10"
                  max="500"
                  step="0.1"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="font-semibold text-start block text-sm sm:text-base">Address:</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base"
                placeholder="Enter address"
                rows="3"
              />
            </div>
          </div>

          {/* Subscription Details Section */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-start block text-sm sm:text-base mb-3 text-gray-700">Subscription Details</h3>
            <div>
              <label className="font-semibold text-start block text-sm sm:text-base">Subscription Plan | Extra Days</label>
              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                <select
                  name="subscription_plan"
                  value={form.subscription_plan || 'Custom'}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 text-sm sm:text-base"
                >
                  {plans.map((plan) => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="extra_days"
                  value={form.extra_days}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 text-sm sm:text-base"
                  placeholder="Extra Days"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-start block text-sm sm:text-base">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base"
                placeholder="Enter Amount"
                min="0"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-start block text-sm sm:text-base">Start Date (required)</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1 text-sm sm:text-base"
                placeholder="dd-mm-yyyy"
                required
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-end">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-900 cursor-pointer text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-black px-6 py-2 rounded font-semibold hover:bg-gray-300 cursor-pointer text-sm sm:text-base"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 