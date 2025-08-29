import React, { useState, useEffect } from "react";
import apis from "@/configs/apis";
import { fetchApi } from "@/services/api";
import { AuthContext } from "@/contexts/AuthContext";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCustomer, setIsCustomer] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const sendOTP = async (phone) => {
    try {
      const data = await fetchApi(apis.AUTH_API.CUSTOMER_GET_OTP, "POST", {
        phone,
      });
      return data;
    } catch (error) {
      throw new Error(error.message || "Không thể gửi OTP");
    }
  };

  const customerLogin = async (phone, otp_code) => {
    const res = await fetchApi("/auth/customer/verify-otp", "POST", {
      phone,
      otp_code,
    });
    if (res?.data?.customer && res.data.tokens) {
      setCurrentUser(res.data.customer);
      setIsCustomer(true);
      localStorage.setItem("user", JSON.stringify(res.data.customer));
      localStorage.setItem("tokens", JSON.stringify(res.data.tokens));
      return res.data.customer;
    }
    throw new Error("OTP không đúng");
  };

  const staffLogin = async (username, password) => {
    const res = await fetchApi(apis.AUTH_API.STAFF_LOGIN, "POST", {
      username,
      password,
    });
    if (res?.data?.user && res.data?.tokens) {
      setCurrentUser(res.data.user);
      setIsCustomer(false);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("tokens", JSON.stringify(res.data.tokens));
      return res.data.user;
    }
    throw new Error("Đăng nhập thất bại");
  };

  const register = async (staffData) => {
    try {
      const payload = {
        username: staffData.username,
        password: staffData.password,
        first_name: staffData.firstName,
        last_name: staffData.lastName,
        phone: staffData.phone,
        email: staffData.email,
        address: staffData.address,
        gender: staffData.gender || "male",
      };

      const data = await fetchApi(
        apis.AUTH_API.STAFF_REGISTER,
        "POST",
        payload
      );

      if (data?.success && data?.data) {
        return data;
      }
    } catch (error) {
      throw new Error(error.message || "Đăng ký thất bại");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    setIsCustomer(true);
    setCurrentUser(null);
  };

  const isStaff = currentUser?.role === "staff";
  const isOwner = currentUser?.role === "owner";
  const isAuthenticated = !!currentUser;

  const value = {
    currentUser,
    loading,
    customerLogin,
    logout,
    register,
    sendOTP,
    staffLogin,
    isCustomer,
    isStaff,
    isOwner,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
