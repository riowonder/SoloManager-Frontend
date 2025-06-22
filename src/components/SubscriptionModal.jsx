import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import EditSubscriptionModal from './EditSubscriptionModal';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Current', value: 'current' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Expired', value: 'expired' },
];

const PLAN_OPTIONS = [
  '1 Month',
  '3 Months',
  '6 Months',
  '1 Year',
  'Custom',
];

function AddSubscriptionForm({ memberId, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    plan: '',
    amount: '',
    extra_days: '',
    start_date: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      if (form.status) payload.status = form.status;
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/member/${memberId}/subscription`,
        payload,
        { withCredentials: true }
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <div>
        <label className="font-semibold block">Plan</label>
        <select
          name="plan"
          value={form.plan}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mt-1"
          required
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
        <label className="font-semibold block">Amount</label>
        <input type="number" name="amount" value={form.amount} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
      </div>
      <div>
        <label className="font-semibold block">Extra Days</label>
        <input type="number" name="extra_days" value={form.extra_days} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
      </div>
      <div>
        <label className="font-semibold block">Start Date</label>
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
      </div>
      <div>
        <label className="font-semibold block">Subscription Status </label>
        <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1">
          <option value="" disabled>Select a status (optional)</option>
          <option value="Active">Active</option>
          <option value="Upcoming">Upcoming</option>
        </select>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-4 mt-2 justify-end">
        <button type="submit" className="bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-900 cursor-pointer" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        <button type="button" className="bg-gray-200 text-black px-6 py-2 rounded font-semibold hover:bg-gray-300 cursor-pointer" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function SubscriptionModal({ isOpen, onClose, memberId, onSuccess }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchSubscriptions();
    // eslint-disable-next-line
  }, [isOpen, filter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/member/${memberId}/subscriptions?filter=${filter}`, { withCredentials: true });
      setSubscriptions(res.data.subscriptions || []);
    } catch (err) {
      toast.error('Failed to fetch subscriptions');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subscription) => {
    setSelectedSubscription(subscription);
    setShowEdit(true);
  };

  const handleDelete = async (subscription) => {
    const confirmed = await new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-black/50';
      modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">Delete Subscription</h3>
            </div>
          </div>
          <p class="text-sm text-gray-500 mb-6">
            Are you sure you want to delete the <span class="font-semibold">${subscription.plan}</span> subscription? This action cannot be undone.
          </p>
          <div class="flex gap-3 justify-end">
            <button id="cancel-btn" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button id="delete-btn" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Delete
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      const cancelBtn = modal.querySelector('#cancel-btn');
      const deleteBtn = modal.querySelector('#delete-btn');
      
      const cleanup = () => {
        document.body.removeChild(modal);
      };
      
      cancelBtn.addEventListener('click', () => {
        cleanup();
        resolve(false);
      });
      
      deleteBtn.addEventListener('click', () => {
        cleanup();
        resolve(true);
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          cleanup();
          resolve(false);
        }
      });
    });
    
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/member/subscription/${subscription._id}`,
        { withCredentials: true }
      );
      toast.success('Subscription deleted successfully!');
      fetchSubscriptions();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete subscription');
    }
  };

  const handleEditSuccess = () => {
    fetchSubscriptions();
    if (onSuccess) onSuccess();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-4xl relative flex flex-col max-h-[90vh]">
          <button className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-black transition cursor-pointer" onClick={onClose}>&times;</button>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 mt-8 text-center tracking-tight text-gray-900 px-4">Subscriptions</h2>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-8 mt-2 gap-4">
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  className={`px-3 py-1 rounded text-sm ${filter === f.value ? 'bg-black text-white' : 'bg-gray-100 text-black'} font-semibold cursor-pointer`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 cursor-pointer text-sm sm:text-base" onClick={() => setShowAdd(true)}>
              Add Subscription
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 custom-scrollbar" style={{ minHeight: 0, maxHeight: '60vh' }}>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No subscriptions found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr>
                      <th className="px-2 sm:px-4 py-3 text-left font-bold text-gray-800 text-xs sm:text-sm">Plan</th>
                      <th className="px-2 sm:px-4 py-3 text-left font-bold text-gray-800 text-xs sm:text-sm">Status</th>
                      <th className="px-2 sm:px-4 py-3 text-left font-bold text-gray-800 text-xs sm:text-sm">Amount</th>
                      <th className="px-2 sm:px-4 py-3 text-left font-bold text-gray-800 text-xs sm:text-sm">Extra Days</th>
                      <th className="px-2 sm:px-4 py-3 text-left font-bold text-gray-800 text-xs sm:text-sm">Start Date</th>
                      <th className="px-2 sm:px-4 py-3 text-left font-bold text-gray-800 text-xs sm:text-sm">End Date</th>
                      <th className="px-2 sm:px-4 py-3 text-left font-bold text-gray-800 text-xs sm:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => (
                      <tr key={sub._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-3 text-left text-gray-900 text-xs sm:text-sm">{sub.plan}</td>
                        <td className="px-2 sm:px-4 py-3 text-left text-gray-900">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            sub.status === 'Active' ? 'bg-green-100 text-green-800' :
                            sub.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-left text-gray-900 text-xs sm:text-sm">₹{sub.amount}</td>
                        <td className="px-2 sm:px-4 py-3 text-left text-gray-900 text-xs sm:text-sm">{sub.extra_days || 0}</td>
                        <td className="px-2 sm:px-4 py-3 text-left text-gray-900 text-xs sm:text-sm">
                          {sub.start_date ? new Date(sub.start_date).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : ''}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-left text-gray-900 text-xs sm:text-sm">
                          {sub.end_date ? new Date(sub.end_date).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : ''}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-left">
                          <div className="flex gap-1 sm:gap-2">
                            <button
                              onClick={() => handleEdit(sub)}
                              className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium px-1 sm:px-2 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(sub)}
                              className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium px-1 sm:px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-lg relative">
                <button className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-black transition cursor-pointer" onClick={() => setShowAdd(false)}>&times;</button>
                <h3 className="text-xl sm:text-2xl font-bold mb-4">Add Subscription</h3>
                <AddSubscriptionForm 
                  memberId={memberId} 
                  onSuccess={() => {
                    setShowAdd(false);
                    fetchSubscriptions();
                    if (onSuccess) onSuccess();
                  }} 
                  onCancel={() => setShowAdd(false)} 
                />
              </div>
            </div>
          )}
          <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 8px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
            .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #e5e7eb #fff; }
          `}</style>
        </div>
      </div>

      {/* Edit Subscription Modal */}
      {showEdit && selectedSubscription && (
        <EditSubscriptionModal
          isOpen={showEdit}
          onClose={() => {
            setShowEdit(false);
            setSelectedSubscription(null);
          }}
          subscription={selectedSubscription}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
} 