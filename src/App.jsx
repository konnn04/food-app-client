import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import useAuth from '@/hooks/useAuth';
import AuthProvider from '@/contexts/AuthProvider';
import AppLayout from '@/components/layout/AppLayout';
import HamburgerLoader from '@/components/ui/hamburger-loader';
import { Toaster } from '@/components/ui/sonner';
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
import EditProfile from '@/pages/profile/EditProfile';
import RestaurantDetailPage from '@/pages/restaurant/RestaurantDetailPage';
import OrdersPage from '@/pages/orders/OrdersPage';
import OrderDetailPage from '@/pages/orders/OrderDetailPage';
import StaffMenuPage from '@/pages/staff/StaffMenuPage';
import StaffHome from '@/pages/home/StaffHome';
import StaffFoodEditPage from '@/pages/staff/StaffFoodEditPage';
import StaffRestaurantSettings from '@/pages/staff/StaffRestaurantSettings';
import StaffReviewsPage from '@/pages/staff/StaffReviewsPage';
// Payment pages (to be created)
import PaymentDepositPage from '@/pages/payment/DepositPage';
import PaymentWithdrawPage from '@/pages/payment/WithdrawPage';
import VNPayReturnPage from '@/pages/payment/VNPayReturnPage';
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

function StaffRoute({ children }) {
  const { currentUser, loading, isCustomer } = useAuth();
  if (loading) return <AppLoading />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (isCustomer) return <Navigate to="/" replace />;
  return children;
}

function RoleHome() {
  const { currentUser } = useAuth();
  // Owner/staff see same layout for now; extend later if needed
  if (currentUser?.role === 'owner' || currentUser?.role === 'staff') {
    return (
      <AppLayout>
        <StaffHome />
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <CustomerHome />
    </AppLayout>
  );
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
            <RoleHome />
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
        path="/profile/edit" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <EditProfile />
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
      <Route 
        path="/orders/:id" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <OrderDetailPage />
            </AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Owner routes */}
      <Route 
        path="/staff/menu" 
        element={
          <StaffRoute>
            <AppLayout>
              <StaffMenuPage />
            </AppLayout>
          </StaffRoute>
        } 
      />
      <Route 
        path="/staff/menu/:id" 
        element={
          <StaffRoute>
            <AppLayout>
              <StaffFoodEditPage />
            </AppLayout>
          </StaffRoute>
        } 
      />
      <Route 
        path="/staff/restaurant" 
        element={
          <StaffRoute>
            <AppLayout>
              <StaffRestaurantSettings />
            </AppLayout>
          </StaffRoute>
        } 
      />
      <Route 
        path="/staff/reviews" 
        element={
          <StaffRoute>
            <AppLayout>
              <StaffReviewsPage />
            </AppLayout>
          </StaffRoute>
        } 
      />

      {/* Payments */}
      <Route 
        path="/payment/deposit" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <PaymentDepositPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/payment/withdraw" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <PaymentWithdrawPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/api/payment/vnpay/return/" 
        element={<VNPayReturnPage />} 
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
            <Toaster richColors position="top-center" />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;