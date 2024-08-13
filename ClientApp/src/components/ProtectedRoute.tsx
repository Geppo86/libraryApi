import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component to guard routes that require authentication or specific permissions.
 * 
 * @param {boolean} isAllowed - A boolean value indicating whether access to the route is allowed.
 * @param {React.ReactNode} children - The component(s) to render if access is allowed.
 * 
 * @returns {JSX.Element} If `isAllowed` is true, renders the `children` components; otherwise, redirects to the login page.
 */
const ProtectedRoute: React.FC<{ isAllowed: boolean; children: React.ReactNode }> = ({ isAllowed, children }) => {

    /**
     * If access is not allowed (i.e., `isAllowed` is false), the user is redirected to the login page.
     */
    if (!isAllowed) {
        return <Navigate to="/login" />;
    }

    /**
     * If access is allowed (i.e., `isAllowed` is true), the component(s) passed as `children` are rendered.
     */
    return <>{children}</>;
};

export default ProtectedRoute;
