import { useState } from 'react';
import { useAuth as useAuthContext } from '../contexts/AuthContext';

export const useCustomerLogin = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { verifyOTP } = useAuthContext();

  const sendOTP = async () => {
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }

    setLoading(true);
    setError('');

    try {
      setShowOtp(true);
      setError('Mã OTP đã được gửi! Sử dụng mã: 000000');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPCode = async () => {
    if (!otp.trim()) {
      setError('Vui lòng nhập mã OTP');
      return false;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOTP(phone, otp);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPhone('');
    setOtp('');
    setShowOtp(false);
    setError('');
  };

  return {
    phone,
    setPhone,
    otp,
    setOtp,
    showOtp,
    setShowOtp,
    loading,
    error,
    sendOTP,
    verifyOTPCode: verifyOTPCode,
    resetForm
  };
};

export const useStaffLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { staffLogin } = useAuthContext();

  const login = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return false;
    }

    setLoading(true);
    setError('');

    try {
      await staffLogin(username, password);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setError('');
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    login,
    resetForm
  };
};
