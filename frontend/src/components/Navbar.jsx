import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

// Navbar component
function Navbar() {
    // console.log("DEBUG: Rendering Navbar");

    const user = AuthService.getCurrentUser();
    const navigate = useNavigate();

    // Handle logout click
    const handleLogout = () => {
        console.log("DEBUG: User logging out");
        AuthService.logout();
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-indigo-600">TaskManager</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {/* Check if user is logged in to show correct links */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700">Hello, {user.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Signup
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
