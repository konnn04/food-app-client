import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
// Components
import AuthLayout from './LayoutPage';
import FormField from '@/components/auth/FormField';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Cập nhật form state
  const [staffForm, setStaffForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    gender: 'male' // Mặc định
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (value) => {
    setStaffForm(prev => ({
      ...prev,
      gender: value
    }));
  };

  const validateForm = () => {
    if (!staffForm.username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return false;
    }
    
    if (!staffForm.firstName.trim()) {
      setError('Vui lòng nhập tên');
      return false;
    }
    
    if (!staffForm.lastName.trim()) {
      setError('Vui lòng nhập họ');
      return false;
    }
    
    if (!staffForm.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(staffForm.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    
    if (!staffForm.phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }
    
    if (!/^[0-9]{10,11}$/.test(staffForm.phone.replace(/\s/g, ''))) {
      setError('Số điện thoại không hợp lệ');
      return false;
    }
    
    if (!staffForm.address.trim()) {
      setError('Vui lòng nhập địa chỉ');
      return false;
    }
    
    if (!staffForm.password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    
    if (staffForm.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    
    if (staffForm.password !== staffForm.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await register(staffForm);

      if (response?.success) {
        setSuccess(response.message || 'Đăng ký thành công! Vui lòng đăng nhập.');

        setStaffForm({
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          password: '',
          confirmPassword: '',
          gender: 'male'
        });

        setTimeout(() => {
          navigate('/staff/login');
        }, 3000);
      } else {
        throw new Error('Đăng ký thất bại');
      }
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  const footerContent = (
    <>
      {/* Login link */}
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link 
            to="/login" 
            className="text-primary hover:underline font-medium"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      {/* Info notice */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800 font-medium mb-1">Lưu ý:</p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Tài khoản sẽ được xem xét và phê duyệt trong 24-48 giờ</li>
          <li>• Sau khi đăng ký, vui lòng tạo nhà hàng của bạn</li>
          <li>• Vui lòng cung cấp thông tin chính xác để tránh delay</li>
        </ul>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="Đăng ký tài khoản Owner"
      subtitle="Đăng ký để trở thành đối tác của chúng tôi"
      error={error}
      success={success}
      footerContent={footerContent}
    >
      {/* Staff registration form */}
      <form onSubmit={handleRegister} className="space-y-4">
        <FormField
          id="username"
          name="username"
          type="text"
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập"
          value={staffForm.username}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="firstName"
            name="firstName"
            type="text"
            label="Tên"
            placeholder="Nhập tên"
            value={staffForm.firstName}
            onChange={handleInputChange}
            disabled={loading}
            required
          />

          <FormField
            id="lastName"
            name="lastName"
            type="text"
            label="Họ"
            placeholder="Nhập họ"
            value={staffForm.lastName}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>

        <FormField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Nhập email"
          value={staffForm.email}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        <FormField
          id="phone"
          name="phone"
          type="tel"
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          value={staffForm.phone}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        <FormField
          id="address"
          name="address"
          type="text"
          label="Địa chỉ"
          placeholder="Nhập địa chỉ"
          value={staffForm.address}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        {/* Gender Select */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Giới tính</label>
          <Select value={staffForm.gender} onValueChange={handleGenderChange} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Nam</SelectItem>
              <SelectItem value="female">Nữ</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <FormField
          id="password"
          name="password"
          type="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
          value={staffForm.password}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        <FormField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          value={staffForm.confirmPassword}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
        </Button>
      </form>
    </AuthLayout>
  );
}