// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const AdminRoute = () => {
//     const { user, role, loading } = useAuth();

//     if (loading) return <div>Loading...</div>; 
//     if (!user || role !== 'admin') {
//         return <Navigate to="/" replace />;
//     }
//     return <Outlet/>
// };

// export default AdminRoute;