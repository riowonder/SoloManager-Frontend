import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditMemberModal from './EditMemberModal';
import SubscriptionModal from './SubscriptionModal';

export default function ShowMemberModal({ isOpen, onClose, member, onSave }) {
  const [details, setDetails] = useState(member || {});
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  useEffect(() => {
    if (isOpen && member && member._id) {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/member/${member._id}`, { withCredentials: true })
        .then(response => {
          setDetails(response.data.member);
        })
        .catch(() => {
          setDetails(member); // fallback to prop
        })
        .finally(() => setLoading(false));
    } else if (member) {
      setDetails(member);
    }
    // eslint-disable-next-line
  }, [isOpen, member && member._id]);

  if (!isOpen || !member) return null;
  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative text-center">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
      </div>
    </div>
  );

  // Get latest subscription
  const latestSub = details.latest_subscription || (details.subscriptions && details.subscriptions[0]);

  const handleEdit = () => setShowEdit(true);
  const handleEditClose = () => setShowEdit(false);
  const handleEditSave = (updatedMember) => {
    setDetails(updatedMember);
    setShowEdit(false);
    if (onSave) onSave(updatedMember);
  };

  return (
    <>
      {/* 
        Fix for flashing/vanishing info:
        - Only show modal content after details are loaded from API (not just from props).
        - Use a loading state to avoid rendering incomplete/old data.
      */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 overflow-auto p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl font-bold text-gray-400 hover:text-black transition cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-center tracking-tight text-gray-900">
            Member Details
          </h2>

          {/* Details Section */}
          {(!details || Object.keys(details).length === 0) ? (
            <div className="flex items-center justify-center py-8 sm:py-12 text-gray-500 text-base sm:text-lg animate-pulse">
              Loading member details...
            </div>
          ) : (
            <div
              className="flex flex-col gap-3 px-2 py-1 overflow-y-auto custom-scrollbar"
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              {/* Basic Information Section */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-start block text-sm sm:text-base mb-3 text-gray-700 border-b border-gray-200 pb-2">
                  <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-800">📋 Basic Information</span>
                </h3>
                <div className="flex flex-col gap-3 sm:gap-4">
                  {Object.keys(details)
                    .filter(
                      (key) =>
                        typeof details[key] !== 'object' && // Filter out objects
                        key !== "_id" &&
                        key !== "__v" &&
                        key !== "createdAt" &&
                        key !== "updatedAt" &&
                        key !== "gym_id" &&
                        key !== "subscriptions" &&
                        key !== "latest_subscription" &&
                        !['height', 'weight', 'gender', 'address'].includes(key) // Exclude personal details but keep age
                    )
                    .sort((a, b) => {
                      // Sort to show name, roll, phone_number first, then others
                      const order = ["name", "roll", "phone_number"];
                      const aIdx = order.indexOf(a);
                      const bIdx = order.indexOf(b);
                      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
                      if (aIdx !== -1) return -1;
                      if (bIdx !== -1) return 1;
                      return a.localeCompare(b);
                    })
                    .map((key) => {
                      let value = details[key];
                      if (key.toLowerCase().includes("date") && value)
                        value = value.slice(0, 10);
                      return (
                        <div key={key} className="flex items-baseline gap-2 text-sm sm:text-base">
                          <span className="font-semibold capitalize text-gray-700 min-w-fit">
                            {key.replace(/_/g, " ")}:
                          </span>
                          <span className="text-gray-900 break-words">{value || "N/A"}</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Personal Details Section */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-start block text-sm sm:text-base mb-3 text-gray-700 border-b border-gray-200 pb-2">
                  <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-800">📋 Personal Details</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Phone Number:</span>
                    <span className="text-gray-900 text-sm sm:text-base">{details.phone_number || "N/A"}</span>
                  </div> */}
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Gender:</span>
                    <span className="text-gray-900 text-sm sm:text-base">{details.gender || "N/A"}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Height:</span>
                    <span className="text-gray-900 text-sm sm:text-base">{details.height ? `${details.height} cm` : "N/A"}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Weight:</span>
                    <span className="text-gray-900 text-sm sm:text-base">{details.weight ? `${details.weight} kg` : "N/A"}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Address:</span>
                    <span className="text-gray-900 text-sm sm:text-base break-words">{details.address || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-end">
            <button
              type="button"
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded font-semibold hover:bg-blue-700 transition cursor-pointer text-sm sm:text-base"
              onClick={() => setShowSubscription(true)}
              disabled={!details || Object.keys(details).length === 0}
            >
              Show Subscription
            </button>
            <button
              type="button"
              className="bg-black text-white px-4 sm:px-6 py-2 rounded font-semibold hover:bg-gray-900 transition cursor-pointer text-sm sm:text-base"
              onClick={handleEdit}
              disabled={!details || Object.keys(details).length === 0}
            >
              Edit
            </button>
            <button
              type="button"
              className="bg-gray-100 text-black px-4 sm:px-6 py-2 rounded font-semibold hover:bg-gray-200 transition cursor-pointer text-sm sm:text-base"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscription && (
        <SubscriptionModal
          isOpen={showSubscription}
          onClose={() => setShowSubscription(false)}
          memberId={details._id}
          onSuccess={onSave}
        />
      )}

      {/* Edit Member Modal */}
      {showEdit && (
        <EditMemberModal
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          member={details}
          onSave={handleEditSave}
        />
      )}

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
    </>
  );
}