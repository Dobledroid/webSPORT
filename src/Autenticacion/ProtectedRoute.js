import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Asegúrate de ajustar la ruta de importación según tu estructura de archivos.

const ProtectedRoute = () => {
  const { user } = useAuth();
  console.log("ProtectedRoute", user);
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
