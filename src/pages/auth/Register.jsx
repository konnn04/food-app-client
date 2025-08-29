import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
// Components
import AuthLayout from './Layout';
import FormField from '@/components/auth/FormField';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Restaurant registration form
  const [restaurantForm, setRestaurantForm] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    taxCode: '',
    password: '',
    confirmPassword: ''
  });

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleRestaurantInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateRestaurantForm = () => {
    if (!restaurantForm.restaurantName.trim()) {
      setError('Vui lòng nhập tên nhà hàng');
      return false;
    }
    
    if (!restaurantForm.ownerName.trim()) {
      setError('Vui lòng nhập tên chủ nhà hàng');
      return false;
    }
    
    if (!restaurantForm.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(restaurantForm.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    
    if (!restaurantForm.phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }
    
    if (!/^[0-9]{10,11}$/.test(restaurantForm.phone.replace(/\s/g, ''))) {
      setError('Số điện thoại không hợp lệ');
      return false;
    }
    
    if (!restaurantForm.address.trim()) {
      setError('Vui lòng nhập địa chỉ');
      return false;
    }
    
    if (!restaurantForm.taxCode.trim()) {
      setError('Vui lòng nhập mã số thuế');
      return false;
    }
    
    if (!restaurantForm.password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    
    if (restaurantForm.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    
    if (restaurantForm.password !== restaurantForm.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }

    return true;
  };

  const handleRestaurantRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRestaurantForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Mock restaurant registration - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Đăng ký thành công! Tài khoản của bạn đang chờ phê duyệt.');
      
      // Reset form
      setRestaurantForm({
        restaurantName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        taxCode: '',
        password: '',
        confirmPassword: ''
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
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
          <li>• Khách hàng có thể đặt món trực tiếp mà không cần đăng ký</li>
          <li>• Vui lòng cung cấp thông tin chính xác để tránh delay</li>
        </ul>
      </div>

      {/* Demo info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 font-medium mb-2">Demo đăng ký:</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Nhà hàng</Badge>
            <span className="text-xs text-gray-600">Điền form đầy đủ để đăng ký</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <AuthLayout
      title="Đăng ký nhà hàng"
      subtitle="Đăng ký để trở thành đối tác của chúng tôi"
      error={error}
      success={success}
      footerContent={footerContent}
    >
      {/* Restaurant registration form */}
      <form onSubmit={handleRestaurantRegister} className="space-y-4">
        <FormField
          id="restaurantName"
          name="restaurantName"
          type="text"
          label="Tên nhà hàng"
          placeholder="Nhập tên nhà hàng"
          value={restaurantForm.restaurantName}
          onChange={handleRestaurantInputChange}
          disabled={loading}
          required
        />

        <FormField
          id="ownerName"
          name="ownerName"
          type="text"
          label="Tên chủ nhà hàng"
          placeholder="Nhập tên chủ nhà hàng"
          value={restaurantForm.ownerName}
          onChange={handleRestaurantInputChange}
          disabled={loading}
          required
        />

        <FormField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Nhập email"
          value={restaurantForm.email}
          onChange={handleRestaurantInputChange}
          disabled={loading}
          required
        />

        <FormField
          id="phone"
          name="phone"
          type="tel"
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          value={restaurantForm.phone}
          onChange={handleRestaurantInputChange}
          disabled={loading}
          required
        />

        <FormField
          id="address"
          name="address"
          type="text"
          label="Địa chỉ"
          placeholder="Nhập địa chỉ nhà hàng"
          value={restaurantForm.address}
          onChange={handleRestaurantInputChange}
          disabled={loading}
          required
        />

        <FormField
          id="taxCode"
          name="taxCode"
          type="text"
          label="Mã số thuế"
          placeholder="Nhập mã số thuế"
          value={restaurantForm.taxCode}
          onChange={handleRestaurantInputChange}
          disabled={loading}
          required
        />

        <FormField
          id="password"
          name="password"
          type="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
          value={restaurantForm.password}
          onChange={handleRestaurantInputChange}
          disabled={loading}
          required
        />

        <FormField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          value={restaurantForm.confirmPassword}
          onChange={handleRestaurantInputChange}
          disabled={loading}
          required
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký nhà hàng"}
        </Button>
      </form>
    </AuthLayout>
  );
}