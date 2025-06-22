import React from 'react';
import { X } from 'lucide-react';

const ExpiredSubscriptionsModal = ({ isOpen, onClose, expiredSubscriptions }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const calculateDaysExpired = (endDate) => {
    if (!endDate) return 0;
    return Math.ceil((new Date() - new Date(endDate)) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Expired Subscriptions</h2>
            <p className="text-sm text-gray-600 mt-1">
              {expiredSubscriptions?.length || 0} member{expiredSubscriptions?.length !== 1 ? 's' : ''} with expired subscriptions
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
          {!expiredSubscriptions || expiredSubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600 mb-2">No expired subscriptions</p>
              <p className="text-sm text-gray-500">All members have active subscriptions</p>
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
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Expired Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Days Expired</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {expiredSubscriptions.map((member, idx) => {
                        const expiredDate = member.subscriptions?.[0]?.end_date;
                        const daysExpired = calculateDaysExpired(expiredDate);
                        
                        return (
                          <tr key={member._id || idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900 font-medium">{member.name}</td>
                            <td className="px-4 py-3 text-gray-700">{member.roll_no}</td>
                            <td className="px-4 py-3 text-gray-700">{member.subscriptions?.[0]?.plan || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-700">{formatDate(expiredDate)}</td>
                            <td className="px-4 py-3 text-gray-700">{member.phone_number || 'N/A'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                daysExpired <= 7 ? 'bg-red-100 text-red-800' :
                                daysExpired <= 30 ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {daysExpired} {daysExpired === 1 ? 'day' : 'days'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {expiredSubscriptions.map((member, idx) => {
                  const expiredDate = member.subscriptions?.[0]?.end_date;
                  const daysExpired = calculateDaysExpired(expiredDate);
                  
                  return (
                    <div key={member._id || idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          daysExpired <= 7 ? 'bg-red-100 text-red-800' :
                          daysExpired <= 30 ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {daysExpired} {daysExpired === 1 ? 'day' : 'days'} expired
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Roll No:</span>
                          <span className="font-medium">{member.roll_no}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Plan:</span>
                          <span className="font-medium">{member.subscriptions?.[0]?.plan || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expired Date:</span>
                          <span className="font-medium">{formatDate(expiredDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phone:</span>
                          <span className="font-medium">{member.phone_number || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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

export default ExpiredSubscriptionsModal; 