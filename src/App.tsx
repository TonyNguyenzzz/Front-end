// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Residents from './pages/Residents/Residents';
import Apartments from './pages/Apartments/Apartments';
import Payments from './pages/Payments/Payments';
import Buildings from './pages/Buildings/Buildings';
import ResidenceHistory from './pages/ResidenceHistory/ResidenceHistory';
import Repairs from './pages/Repairs/Repairs';
import Reports from './pages/Reports/Reports';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import useAuth from './hooks/useAuth';
import { Box, Toolbar } from '@mui/material';

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register'];

  return (
    <Box sx={{ display: 'flex' }}>
      {user && !hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {user && !hideNavbarRoutes.includes(location.pathname) && <Toolbar />}
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/residents"
            element={
              <ProtectedRoute>
                <Residents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apartments"
            element={
              <ProtectedRoute>
                <Apartments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buildings"
            element={
              <ProtectedRoute>
                <Buildings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/residence-history"
            element={
              <ProtectedRoute>
                <ResidenceHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repairs"
            element={
              <ProtectedRoute>
                <Repairs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirect unknown routes */}
          <Route
            path="*"
            element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </Box>
    </Box>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
