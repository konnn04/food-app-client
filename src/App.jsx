import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import useAuth  from '@/hooks/useAuth';
import AuthProvider from '@/contexts/AuthProvider';
import AppLayout from '@/components/layout/AppLayout';
import HamburgerLoader from '@/components/ui/hamburger-loader';
// Pages
import LoginCustomer from '@/pages/auth/LoginCustomer';
import LoginStaff from '@/pages/auth/LoginStaff';
import Register from '@/pages/auth/Register';
import Home from '@/pages/home/Home';
import Profile from '@/pages/profile/Profile';

// Loading Component
function AppLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <HamburgerLoader size="lg" />
    </div>
  );
}

function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <AppLoading />;
  if (currentUser) return <Navigate to="/" replace />;
  return children;
}

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <AppLoading />;
  }
  
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginCustomer />
          </PublicRoute>
        } 
      />
      <Route 
        path="/staff/login" 
        element={
          <PublicRoute>
            <LoginStaff />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Home />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}



function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;