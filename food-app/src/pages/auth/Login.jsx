import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { DEMO_ACCOUNTS } from "../../utils/constants";
import HamburgerLoader from '@/components/ui/hamburger-loader';

// Components
import AuthLayout from "../../components/auth/AuthLayout";
import FormField from "../../components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Login() {
  const [activeTab, setActiveTab] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const [userForm, setUserForm] = useState({
    phone: "",
    otp: ""
  });
  
  const [staffForm, setStaffForm] = useState({
    username: "",
    password: ""
  });

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { value: "user", label: "Khách hàng" },
    { value: "staff", label: "Nhân viên" }
  ];

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStaffInputChange = (e) => {
    const { name, value } = e.target;
    setStaffForm(prev => ({
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

  const validateStaffForm = () => {
    if (!staffForm.username.trim()) {
      setError("Vui lòng nhập tên đăng nhập hoặc email");
      return false;
    }
    if (!staffForm.password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return false;
    }
    if (staffForm.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess("Đăng nhập thành công!");
      
      const userData = {
        id: 1,
        phone: userForm.phone,
        role: "customer",
        name: "Khách hàng"
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      
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

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    
    if (!validateStaffForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess("Đăng nhập thành công!");
      
      const staffData = {
        id: 2,
        username: staffForm.username,
        role: "staff",
        name: "Nhân viên"
      };
      
      localStorage.setItem("user", JSON.stringify(staffData));
      
      if (rememberMe) {
        localStorage.setItem("savedLogin", JSON.stringify({
          username: staffForm.username,
          rememberMe: true
        }));
      } else {
        localStorage.removeItem("savedLogin");
      }
      
      setTimeout(() => {
        navigate("/");
      }, 1000);
      
    } catch (err) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess("Mã OTP đã được gửi đến số điện thoại của bạn");
      setOtpSent(true);
    } catch (err) {
      setError("Không thể gửi mã OTP. Vui lòng thử lại.");
      console.error("Send OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
    setOtpSent(false);
    setUserForm({ phone: "", otp: "" });
  };

  useEffect(() => {
    const savedLogin = localStorage.getItem("savedLogin");
    if (savedLogin) {
      const loginData = JSON.parse(savedLogin);
      if (loginData.rememberMe) {
        setStaffForm(prev => ({
          ...prev,
          username: loginData.username
        }));
        setRememberMe(true);
      }
    }
  }, []);

  const footerContent = (
    <>
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link 
            to="/register" 
            className="text-primary hover:underline font-medium"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 font-medium mb-2">Tài khoản demo:</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Khách hàng</Badge>
            <span className="text-xs text-gray-600">SĐT: 0123456789, OTP: 123456</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Nhân viên</Badge>
            <span className="text-xs text-gray-600">admin / 123456</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="Đăng nhập"
      activeTab={activeTab}
      tabs={tabs}
      onTabChange={handleTabChange}
      error={error}
      success={success}
      footerContent={footerContent}
    >
      {/* User login form */}
      {activeTab === "user" && (
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
      )}

      {/* Staff login form */}
      {activeTab === "staff" && (
        <form onSubmit={handleStaffLogin} className="space-y-4">
          <FormField
            id="username"
            name="username"
            type="text"
            label="Tên đăng nhập / Email"
            placeholder="Nhập tên đăng nhập hoặc email"
            value={staffForm.username}
            onChange={handleStaffInputChange}
            disabled={loading}
            required
          />

          <FormField
            id="password"
            name="password"
            type="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            value={staffForm.password}
            onChange={handleStaffInputChange}
            disabled={loading}
            required
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={setRememberMe}
            />
            <Label 
              htmlFor="remember" 
              className="text-sm font-normal cursor-pointer"
            >
              Lưu thông tin đăng nhập
            </Label>
          </div>

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
        </form>
      )}
    </AuthLayout>
  );
}