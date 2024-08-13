import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import BookList from './components/Books/BookList';
import BookDetails from './components/Books/BookDetails';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';

/**
 * The main application component that handles routing and state management for authentication.
 */
const App: React.FC = () => {
    // State to track if the user is authenticated
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // State to store the user's role (e.g., "Librarian" or "Customer")
    const [userRole, setUserRole] = useState<string | null>(null);

    // State to store the logged-in user's username
    const [username, setUsername] = useState<string | null>(null);

    /**
     * Handles the login process by setting authentication-related state.
     *
     * @param {string} username - The username of the logged-in user.
     * @param {string} role - The role of the logged-in user.
     */
    const handleLogin = (username: string, role: string) => {
        setIsAuthenticated(true);
        setUserRole(role);
        setUsername(username);
    };

    /**
     * Handles the logout process by resetting authentication-related state
     * and clearing the local storage.
     */
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        setUsername(null);
        localStorage.clear(); // Clear any stored user data
    };

    return (
        <Router>
            <div>
                <Routes>
                    {/* Route for the homepage */}
                    <Route path="/" element={<HomePage />} />

                    {/* Route for the login page */}
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />

                    {/* Route for the signup page */}
                    <Route path="/signup" element={<SignUp />} />

                    {/* Protected route for the book list page, accessible only if authenticated */}
                    <Route
                        path="/books"
                        element={
                            <ProtectedRoute isAllowed={isAuthenticated}>
                                <BookList userRole={userRole} username={username} onLogout={handleLogout} />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected route for the book details page, accessible only if authenticated */}
                    <Route
                        path="/books/:id"
                        element={
                            <ProtectedRoute isAllowed={isAuthenticated}>
                                <BookDetails userRole={userRole} username={username} onLogout={handleLogout} />
                            </ProtectedRoute>
                        }
                    />

                    {/* Route for handling 404 not found errors */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
