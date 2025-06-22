import React, { useState } from 'react';
import { X, Users, Database, Trash2, Edit3, LogOut, DollarSign, Mail, UserPlus } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ChangeGymNameModal from './ChangeGymNameModal';
import InviteManagerModal from './InviteManagerModal';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useUser();
    const [loading, setLoading] = useState(false);
    const [showGymNameModal, setShowGymNameModal] = useState(false);
    const [showInviteManagerModal, setShowInviteManagerModal] = useState(false);
    const navigate = useNavigate();
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/2 bg-opacity-50 transition-opacity z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full bg-white shadow-lg w-80 transform transition-transform duration-300 ease-in-out z-50 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="h-full flex flex-col p-6">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* User Info */}
                    <div className="mt-12 mb-8">
                        <h2 className="text-2xl font-bold mb-2">{user?.gym_name || 'Gym'}</h2>
                        <p className="text-gray-600">{user?.name}</p>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1">
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin/members')}
                                className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 rounded-lg transition-colors text-left mb-2 cursor-pointer"
                            >
                                <Users className="w-5 h-5" />
                                <span>Members</span>
                            </button>
                        )}
                        {user?.role === 'manager' && (
                            <button
                                onClick={() => navigate('/manager/members')}
                                className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 rounded-lg transition-colors text-left mb-2 cursor-pointer"
                            >
                                <Users className="w-5 h-5" />
                                <span>Members</span>
                            </button>
                        )}
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin/finance')}
                                className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 rounded-lg transition-colors text-left mb-2 cursor-pointer"
                            >
                                <DollarSign className="w-5 h-5" />
                                <span>Finance</span>
                            </button>
                        )}
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => setShowInviteManagerModal(true)}
                                className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 rounded-lg transition-colors text-left mb-2 cursor-pointer"
                            >
                                <UserPlus className="w-5 h-5" />
                                <span>Invite Manager</span>
                            </button>
                        )}
                        {/* <button
                            onClick={() => console.log('Backup clicked')}
                            className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 rounded-lg transition-colors text-left mb-2 cursor-pointer"
                        >
                            <Database className="w-5 h-5" />
                            <span>Backup Data</span>
                        </button> */}
                        {/* <button
                            onClick={() => console.log('Delete clicked')}
                            className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 rounded-lg transition-colors text-left mb-2 cursor-pointer"
                        >
                            <Trash2 className="w-5 h-5" />
                            <span>Delete Field</span>
                        </button> */}
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => setShowGymNameModal(true)}
                                className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 rounded-lg transition-colors text-left mb-2 cursor-pointer"
                            >
                                <Edit3 className="w-5 h-5" />
                                <span>Change Gym Name</span>
                            </button>
                        )}
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={() => {
                            setLoading(true);
                            logout();
                            setLoading(false);
                            toast.success("Logged out successfully");
                            navigate("/");
                        }}
                        disabled={loading}
                        className="flex items-center gap-3 w-full p-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors cursor-pointer mb-3 sm:mb-0"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>{loading ? 'Logging out...' : 'Logout'}</span>
                    </button>
                </div>
            </div>

            {/* Change Gym Name Modal */}
            <ChangeGymNameModal
                isOpen={showGymNameModal}
                onClose={() => setShowGymNameModal(false)}
                currentGymName={user?.gym_name}
            />

            {/* Invite Manager Modal */}
            <InviteManagerModal
                isOpen={showInviteManagerModal}
                onClose={() => setShowInviteManagerModal(false)}
            />
        </>
    );
};

export default Sidebar; 