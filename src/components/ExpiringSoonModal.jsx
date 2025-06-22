import React from 'react';
import { X } from 'lucide-react';

const ExpiringSoonModal = ({ isOpen, onClose, expiringSoon }) => {
  if (!isOpen) return null;

  const getDaysLeftColor = (daysLeft) => {
    if (daysLeft === 0) return 'text-red-600 font-bold';
    if (daysLeft <= 4) return 'text-red-500 font-bold';
    if (daysLeft <= 7) return 'text-orange-600 font-bold';
    return 'text-yellow-700 font-bold';
  };

  const getDaysLeftBgColor = (daysLeft) => {
    if (daysLeft === 0) return 'bg-red-100 text-red-800';
    if (daysLeft <= 4) return 'bg-red-100 text-red-800';
    if (daysLeft <= 7) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Expiring Soon (Next 10 Days)</h2>
            <p className="text-sm text-gray-600 mt-1">
              {expiringSoon?.length || 0} member{expiringSoon?.length !== 1 ? 's' : ''} with expiring subscriptions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {!expiringSoon || expiringSoon.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600 mb-2">No expiring soon subscriptions</p>
              <p className="text-sm text-gray-500">All members have active subscriptions with more than 10 days remaining</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Member Name</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Roll No</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Plan</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Days Left</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {expiringSoon.map((member, idx) => (
                        <tr key={member._id || idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900 font-medium">{member.name}</td>
                          <td className="px-4 py-3 text-gray-700">{member.roll_no}</td>
                          <td className="px-4 py-3 text-gray-700">{member.subscriptions?.[0]?.plan || member.subscription_plan || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDaysLeftBgColor(member.days_left)}`}>
                              {member.days_left} {member.days_left === 1 ? 'Day' : 'Days'} left
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{member.phone_number || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              member.days_left === 0 ? 'bg-red-100 text-red-800' :
                              member.days_left <= 2 ? 'bg-red-100 text-red-800' :
                              member.days_left <= 5 ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {member.days_left === 0 ? 'Expires Today' :
                               member.days_left <= 2 ? 'Critical' :
                               member.days_left <= 5 ? 'Warning' : 'Notice'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {expiringSoon.map((member, idx) => (
                  <div key={member._id || idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDaysLeftBgColor(member.days_left)}`}>
                        {member.days_left} {member.days_left === 1 ? 'Day' : 'Days'} left
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Roll No:</span>
                        <span className="font-medium">{member.roll_no}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Plan:</span>
                        <span className="font-medium">{member.subscriptions?.[0]?.plan || member.subscription_plan || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="font-medium">{member.phone_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`font-medium ${getDaysLeftColor(member.days_left)}`}>
                          {member.days_left === 0 ? 'Expires Today' :
                           member.days_left <= 2 ? 'Critical' :
                           member.days_left <= 5 ? 'Warning' : 'Notice'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpiringSoonModal; 