import { createContext, useContext, useState, useEffect } from 'react';
const UserContext = createContext(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            // Check if user data exists in localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
                const parsedUser = JSON.parse(storedUser);
                // Validate that we have the required user data
                if (parsedUser && typeof parsedUser === 'object') {
                    setUser(parsedUser);
                } else {
                    // If the data is invalid, clear it
                    localStorage.removeItem('user');
                }
            }
        } catch (err) {
            console.error('Error loading user data:', err);
            // If there's an error parsing, clear the invalid data
            localStorage.removeItem('user');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (userData) => {
        try {
            if (!userData || typeof userData !== 'object') {
                throw new Error('Invalid user data provided for login');
            }
            // Validate required fields
            if (!userData.email && !userData.name) {
                throw new Error('User data must contain at least an email or name');
            }
            // Ensure role and gym_id are present
            if (!userData.role) {
                userData.role = 'admin'; // Default role
            }
            if (!userData.gym_id) {
                userData.gym_id = userData.id; // For admins, gym_id is their own ID
            }
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
            console.error('Error during login:', err);
            setError(err.message);
            throw err;
        }
    };

    const logout = () => {
        try {
            setUser(null);
            localStorage.removeItem('user');    
        } catch (err) {
            console.error('Error during logout:', err);
            setError(err.message);
            throw err;
        }
    };

    const updateUser = (updatedUserData) => {
        try {
            if (!updatedUserData || typeof updatedUserData !== 'object') {
                throw new Error('Invalid user data provided for update');
            }
            setUser(updatedUserData);
            localStorage.setItem('user', JSON.stringify(updatedUserData));
        } catch (err) {
            console.error('Error during user update:', err);
            setError(err.message);
            throw err;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            window.location.reload();
                        }}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <UserContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    );
}; 