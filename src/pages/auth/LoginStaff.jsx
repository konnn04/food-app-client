import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

import HamburgerLoader from "@/components/ui/hamburger-loader";

// Components
import AuthLayout from "./Layout";
import FormField from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [staffForm, setStaffForm] = useState({
    username: "",
    password: "",
  });

  const { currentUser, staffLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleStaffInputChange = (e) => {
    const { name, value } = e.target;
    setStaffForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleStaffLogin = async (e) => {
    e.preventDefault();

    if (!validateStaffForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await staffLogin({
        username: staffForm.username,
        password: staffForm.password,
      });

      setSuccess("Đăng nhập thành công!");

      if (rememberMe) {
        localStorage.setItem(
          "savedLogin",
          JSON.stringify({
            username: staffForm.username,
            rememberMe: true,
          })
        );
      } else {
        localStorage.removeItem("savedLogin");
      }
    } catch (err) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedLogin = localStorage.getItem("savedLogin");
    if (savedLogin) {
      const loginData = JSON.parse(savedLogin);
      if (loginData.rememberMe) {
        setStaffForm((prev) => ({
          ...prev,
          username: loginData.username,
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
      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          Bạn là khách hàng?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Đăng nhập ngay
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

        <Button type="submit" className="w-full" disabled={loading}>
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
    </AuthLayout>
  );
}
