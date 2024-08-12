import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ isAllowed: boolean; children: React.ReactNode }> = ({ isAllowed, children }) => {
    if (!isAllowed) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
