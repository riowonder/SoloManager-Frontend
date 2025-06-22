import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PLAN_OPTIONS = [
  '1 Month',
  '3 Months',
  '6 Months',
  '1 Year',
  'Custom',
];

const EditSubscriptionModal = ({ isOpen, onClose, subscription, onSuccess }) => {
  const [form, setForm] = useState({
    plan: '',
    amount: '',
    extra_days: '',
    start_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subscription) {
      setForm({
        plan: subscription.plan || '',
        amount: subscription.amount || '',
        extra_days: subscription.extra_days || '',
        start_date: subscription.start_date ? new Date(subscription.start_date).toISOString().split('T')[0] : '',
      });
    }
  }, [subscription]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        plan: form.plan,
        amount: form.amount ? Number(form.amount) : 0,
        extra_days: form.extra_days ? Number(form.extra_days) : 0,
        start_date: form.start_date,
      };

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/member/subscription/${subscription._id}`, payload, { withCredentials: true });

      toast.success('Subscription updated successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update subscription';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-black transition disabled:opacity-50 cursor-pointer"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Edit Subscription
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold block text-gray-700 mb-2">Plan</label>
            <select
              name="plan"
              value={form.plan}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              required
              disabled={loading}
            >
              <option value="" disabled>
                Select a plan
              </option>
              {PLAN_OPTIONS.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              required
              disabled={loading}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="font-semibold block text-gray-700 mb-2">Extra Days</label>
            <input
              type="number"
              name="extra_days"
              value={form.extra_days}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              disabled={loading}
              min="0"
            />
          </div>

          <div>
            <label className="font-semibold block text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
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
              disabled={loading || !form.plan || !form.amount || !form.start_date}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              ) : (
                'Update Subscription'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubscriptionModal; 