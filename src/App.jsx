import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import useAuth  from '@/hooks/useAuth';
import AuthProvider from '@/contexts/AuthProvider';
import AppLayout from '@/components/layout/AppLayout';
import HamburgerLoader from '@/components/ui/hamburger-loader';
// Pages
import LoginCustomer from '@/pages/auth/LoginCustomerPage';
import LoginStaff from '@/pages/auth/LoginStaffPage';
import Register from '@/pages/auth/RegisterPage';
import Home from '@/pages/home/Home';
import CustomerHome from '@/pages/home/CustomerHome';
import SearchPage from '@/pages/search/SearchPage';
import FoodDetailPage from '@/pages/food/FoodDetailPage';
import CartPage from '@/pages/cart/CartPage';
import CheckoutPage from '@/pages/cart/CheckoutPage';
import Profile from '@/pages/profile/Profile';
import RestaurantDetailPage from '@/pages/restaurant/RestaurantDetailPage';
import OrdersPage from '@/pages/orders/OrdersPage';
// import CreateRestaurant from '@/pages/CreateRestaurant'; 

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
              <CustomerHome />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/search" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <SearchPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/food/:id" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <FoodDetailPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/restaurant/:id" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <RestaurantDetailPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cart" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CartPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CheckoutPage />
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
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <OrdersPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* <Route 
        path="/create-restaurant" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreateRestaurant />
            </AppLayout>
          </ProtectedRoute>
        } 
      /> */}
      
      <Route path="*" element={<Navigate to="/" />} />
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