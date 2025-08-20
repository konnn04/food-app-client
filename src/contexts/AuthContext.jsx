import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra localStorage khi app khởi động
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      } finally {
        // Đảm bảo loading được set false
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Mock login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      let userData;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data cho demo
      if (credentials.role === 'customer') {
        userData = {
          id: 1,
          name: 'Khách hàng Demo',
          phone: credentials.phone || '0123456789',
          role: 'customer',
          email: 'customer@demo.com'
        };
      } else if (credentials.role === 'staff') {
        userData = {
          id: 2,
          name: 'Nhân viên Demo',
          username: credentials.username || 'staff',
          role: 'staff',
          email: 'staff@demo.com'
        };
      } else if (credentials.role === 'owner') {
        userData = {
          id: 3,
          name: 'Chủ quán Demo',
          username: credentials.username || 'owner',
          role: 'owner',
          email: 'owner@demo.com'
        };
      }

      // Lưu vào localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);

      return userData;
    } catch (error) {
      throw new Error('Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Register function (cho nhà hàng)
  const register = async (restaurantData) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration
      const userData = {
        id: Date.now(),
        name: restaurantData.ownerName,
        email: restaurantData.email,
        role: 'owner',
        restaurant: {
          name: restaurantData.restaurantName,
          address: restaurantData.address,
          taxCode: restaurantData.taxCode,
          phone: restaurantData.phone
        },
        isApproved: false // Cần phê duyệt
      };

      return userData;
    } catch (error) {
      throw new Error('Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP (mock)
  const sendOTP = async (phone) => {
    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'OTP đã được gửi' };
    } catch (error) {
      throw new Error('Không thể gửi OTP');
    }
  };

  // Verify OTP (mock)
  const verifyOTP = async (phone, otp) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock verification - chấp nhận OTP 123456
      if (otp === '123456') {
        const userData = {
          id: Date.now(),
          name: `Khách hàng ${phone}`,
          phone: phone,
          role: 'customer'
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        
        return userData;
      } else {
        throw new Error('Mã OTP không đúng');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper functions để kiểm tra role
  const isCustomer = currentUser?.role === 'customer';
  const isStaff = currentUser?.role === 'staff';
  const isOwner = currentUser?.role === 'owner';
  const isAuthenticated = !!currentUser;

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    sendOTP,
    verifyOTP,
    isCustomer,
    isStaff,
    isOwner,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export default để dễ import
export default AuthProvider;