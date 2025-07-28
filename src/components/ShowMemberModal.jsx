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
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/member/${member._id}`, {
          withCredentials: true,
        })
        .then((response) => {
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

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg text-center">
          <h2 className="text-2xl font-bold">Loading...</h2>
        </div>
      </div>
    );

  const handleEdit = () => setShowEdit(true);
  const handleEditClose = () => setShowEdit(false);
  const handleEditSave = (updatedMember) => {
    setDetails(updatedMember);
    setShowEdit(false);
    if (onSave) onSave(updatedMember);
  };

  const latestSub = details.latest_subscription || (details.subscriptions && details.subscriptions[0]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-hidden">
          {/* Scrollable container */}
          <div className="overflow-y-auto custom-scrollbar px-6 py-6 sm:px-8 sm:py-8 max-h-[calc(90vh-64px)]">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-xl font-bold text-gray-400 hover:text-black transition cursor-pointer"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-4 text-gray-900">
              Member Details
            </h2>

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                {details.image ? (
                  <img
                    src={details.image}
                    alt="Member"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-5xl text-gray-400">
                    <span role="img" aria-label="User">👤</span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="mb-6 border-b pb-4">
              <h3 className="font-semibold text-sm sm:text-base mb-3 text-gray-700 border-b border-gray-200 pb-2">
                <span className="bg-gray-100 px-3 py-1 rounded-lg">📋 Basic Information</span>
              </h3>
              <div className="flex flex-col gap-3 sm:gap-4">
                {Object.keys(details)
                  .filter(
                    (key) =>
                      typeof details[key] !== 'object' &&
                      key !== "_id" &&
                      key !== "__v" &&
                      key !== "image" &&
                      key !== "createdAt" &&
                      key !== "updatedAt" &&
                      key !== "gym_id" &&
                      key !== "subscriptions" &&
                      key !== "latest_subscription" &&
                      !['height', 'weight', 'gender', 'address'].includes(key)
                  )
                  .sort((a, b) => {
                    const order = ["name", "roll_no", "phone_number"];
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

            {/* Personal Details */}
            <div className="mb-6 border-b pb-4">
              <h3 className="font-semibold text-sm sm:text-base mb-3 text-gray-700 border-b border-gray-200 pb-2">
                <span className="bg-gray-100 px-3 py-1 rounded-lg">📋 Personal Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Gender:</span>
                  <span className="text-gray-900 text-sm sm:text-base">{details.gender || "N/A"}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Height:</span>
                  <span className="text-gray-900 text-sm sm:text-base">
                    {details.height ? `${details.height} cm` : "N/A"}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Weight:</span>
                  <span className="text-gray-900 text-sm sm:text-base">
                    {details.weight ? `${details.weight} kg` : "N/A"}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base min-w-fit">Address:</span>
                  <span className="text-gray-900 text-sm sm:text-base break-words">
                    {details.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-6 pb-6 justify-end">
            <button
              type="button"
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
              onClick={() => setShowSubscription(true)}
            >
              Show Subscription
            </button>
            <button
              type="button"
              className="bg-black text-white px-4 sm:px-6 py-2 rounded font-semibold hover:bg-gray-900 transition text-sm sm:text-base"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              type="button"
              className="bg-gray-100 text-black px-4 sm:px-6 py-2 rounded font-semibold hover:bg-gray-200 transition text-sm sm:text-base"
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

      {/* Scrollbar Styles */}
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
