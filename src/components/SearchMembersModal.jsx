import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function SearchMembersModal({ isOpen, onClose, onSelectMember }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setError('');
      return;
    }
    if (query.trim() === '') {
      setResults([]);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchMembers(query); 
    }, 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [query, isOpen]);

  const searchMembers = async (q) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/member/search?q=${encodeURIComponent(q)}`, { withCredentials: true });
      setResults(res.data.members || []);
      setLoading(false);
    } catch (err) {
      setError('Error searching members');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg relative flex flex-col max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-black transition cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-3xl font-extrabold mb-2 mt-8 text-center tracking-tight text-gray-900">Search Members</h2>
        <div className="px-8 py-4">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Search by name, roll no, or any field..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto px-8 pb-4 custom-scrollbar" style={{ minHeight: 0, maxHeight: '50vh' }}>
          {query.trim() === '' ? (
            <div className="text-center text-gray-400 py-8 text-lg select-none">
              🔍 <span className="font-semibold">Enter something to search for members!</span>
              <div className="text-sm text-gray-300 mt-1">Try typing a name, roll number, or phone number.</div>
            </div>
          ) : loading ? (
            <div className="text-center text-gray-500 py-4 animate-pulse">Searching...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : results.length === 0 ? (
            <div className="text-center text-gray-400 py-4">No members found.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {results.map(member => (
                <li
                  key={member._id}
                  className="py-3 px-2 hover:bg-gray-100 cursor-pointer rounded transition flex flex-col gap-1"
                  onClick={() => onSelectMember && onSelectMember(member)}
                >
                  <span className="font-semibold text-gray-900">
                    {member.name} <span className="text-gray-500">({member.roll_no})</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    Plan: {member.subscriptions[0]?.plan || 'N/A'}
                  </span>
                </li>
              ))}
            </ul>
          )}
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