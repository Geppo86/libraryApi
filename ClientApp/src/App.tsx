import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import BookList from './components/Books/BookList';
import BookDetails from './components/Books/BookDetails';
import EditBook from './components/ManageBooks/EditBook';
import RemoveBook from './components/ManageBooks/RemoveBook';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';


const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    const handleLogin = (username: string, role: string) => {
        setIsAuthenticated(true);
        setUserRole(role);
        setUsername(username);
    };

    return (
        <Router>
            <div>
                <header>
                    {isAuthenticated && (
                        <div>
                            <span>Logged in as: {username}</span>
                            <span>Role: {userRole}</span>
                        </div>
                    )}
                </header>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                        path="/books"
                        element={
                            <ProtectedRoute isAllowed={isAuthenticated}>
                                <BookList userRole={userRole} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/books/:id"
                        element={
                            <ProtectedRoute isAllowed={isAuthenticated}>
                                <BookDetails userRole={userRole} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit-book/:id"
                        element={
                            <ProtectedRoute isAllowed={userRole === 'Librarian'}>
                                <EditBook />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/remove-book/:id"
                        element={
                            <ProtectedRoute isAllowed={userRole === 'Librarian'}>
                                <RemoveBook />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
