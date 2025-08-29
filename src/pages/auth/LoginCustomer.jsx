import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

import HamburgerLoader from '@/components/ui/hamburger-loader';

// Components
import AuthLayout from "./Layout";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [userForm, setUserForm] = useState({
    phone: "",
    otp: ""
  });

  const { customerLogin, sendOTP } = useAuth();
  const navigate = useNavigate();

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUserForm = () => {
    if (!userForm.phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!/^[0-9]{10,11}$/.test(userForm.phone.replace(/\s/g, ''))) {
      setError("Số điện thoại không hợp lệ");
      return false;
    }
    if (!userForm.otp.trim()) {
      setError("Vui lòng nhập mã OTP");
      return false;
    }
    if (!/^[0-9]{6}$/.test(userForm.otp)) {
      setError("Mã OTP phải có 6 chữ số");
      return false;
    }
    return true;
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();

    if (!validateUserForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await customerLogin(userForm.phone, userForm.otp);
      setSuccess("Đăng nhập thành công!");
      setTimeout(() => {
        navigate("/");
      }, 1000); 
    } catch (err) {
      setError("Số điện thoại hoặc mã OTP không đúng");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!userForm.phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }
    if (!/^[0-9]{10,11}$/.test(userForm.phone.replace(/\s/g, ''))) {
      setError("Số điện thoại không hợp lệ");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const data = await sendOTP(userForm.phone);
      console.log("OTP sent successfully:", data?.data?.otp);
      setSuccess("Mã OTP đã được gửi đến số điện thoại của bạn");
      setOtpSent(true);
    } catch (err) {
      setError("Không thể gửi mã OTP. Vui lòng thử lại.");
      console.error("Send OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  const footerContent = (
    <>
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600">
          {" "}
          <Link 
            to="/staff/login" 
            className="text-primary hover:underline font-medium"
          >
            Bạn là nhân viên? Đăng nhập tại đây
          </Link>
        </p>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="Đăng nhập"
      error={error}
      success={success}
      footerContent={footerContent}
    >
      <form onSubmit={handleUserLogin} className="space-y-4">
          <FormField
            id="phone"
            name="phone"
            type="tel"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            value={userForm.phone}
            onChange={handleUserInputChange}
            disabled={loading || otpSent}
            required
          />

          {!otpSent ? (
            <Button 
              type="button"
              className="w-full"
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Nhận mã OTP"}
            </Button>
          ) : (
            <>
              <FormField
                id="otp"
                name="otp"
                type="text"
                label="Mã OTP"
                placeholder="Nhập mã OTP 6 số"
                maxLength={6}
                value={userForm.otp}
                onChange={handleUserInputChange}
                disabled={loading}
                autoFocus
                required
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <HamburgerLoader size="sm" />
                    <span>Đang đăng nhập...</span>
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-sm"
                >
                  Gửi lại mã OTP
                </Button>
              </div>
            </>
          )}
        </form>
    </AuthLayout>
  );
}