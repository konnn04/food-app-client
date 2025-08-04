# 🍕 Food Ordering App

Ứng dụng đặt món ăn trực tuyến với giao diện hiện đại và responsive, hỗ trợ cả web và mobile.

## 🔥 Tính năng chính

### 🔐 Xác thực người dùng
- **Đăng nhập khách hàng**: Số điện thoại + OTP (Mock: 000000)
- **Đăng nhập nhân viên/quản lý**: Email + Password 
- **Đăng ký**: Chỉ dành cho chủ quán/quản lý
- **Phân quyền**: Staff, Manager, Admin

### 🎨 Giao diện & UX
- **Responsive Design**: Tối ưu cho cả desktop và mobile
- **Material-UI**: Components hiện đại và đẹp mắt
- **Light/Dark Mode**: Chuyển đổi chế độ sáng/tối
- **Glass Effect**: Hiệu ứng kính mờ trên form đăng nhập/đăng ký
- **Random Background**: Nền ngẫu nhiên cho trang auth

### 📱 Layout thích ứng
- **Desktop**: Navbar trên cùng với 6 cột sản phẩm tối đa
- **Mobile**: Bottom navigation với 2 cột sản phẩm
- **Theme Colors**: Màu chủ đạo #ff6b6b (đỏ cam)

## 🚀 Cài đặt và chạy ứng dụng

```bash
# Clone repository
git clone <repo-url>
cd food-ordering-app/food-app

# Cài đặt dependencies
npm install

# Chạy ứng dụng development
npm run dev

# Build cho production
npm run build
```

## 📱 Hướng dẫn sử dụng

### Đăng nhập khách hàng
1. Chọn tab "Khách hàng"
2. Nhập số điện thoại bất kỳ (VD: 0987654321)
3. Nhập mã OTP: **000000**
4. Vào trang chủ thành công

### Đăng nhập nhân viên/quản lý
1. Chọn tab "Nhân viên/Quản lý"
2. Sử dụng tài khoản demo:
   - **Nhân viên**: staff@restaurant.com / 123456
   - **Quản lý**: manager@restaurant.com / 123456

### Đăng ký (Chỉ cho chủ quán)
- Điền đầy đủ thông tin cá nhân và kinh doanh
- Bao gồm: Họ tên, email, SĐT, mật khẩu, ngày sinh, mã số thuế, tên nhà hàng

## 🏗️ Cấu trúc dự án

```
food-app/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication forms
│   │   ├── common/         # Reusable components
│   │   └── layout/         # Layout components
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.jsx # Authentication state
│   │   └── ThemeContext.jsx# Theme management
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.js      # Auth logic hooks
│   │   ├── useMediaQuery.js# Responsive hooks
│   │   └── useRandomBackground.js
│   ├── pages/              # Page components
│   │   ├── auth/           # Login & Register
│   │   └── home/           # Home page
│   ├── styles/             # Theme & styling
│   │   └── themeColors.js  # Color configuration
│   ├── utils/              # Utility functions
│   │   ├── constants.js    # App constants
│   │   └── format.js       # Format utilities
│   ├── data/               # Mock data
│   │   └── mockData.js     # Sample data
│   └── assets/             # Static assets
│       ├── logo.png        # App logo
│       └── bg/             # Background images (0.jpg - 5.jpg)
├── index.html
└── package.json
```

## 🛠️ Công nghệ sử dụng

- **React 18** - UI Framework
- **Vite** - Build tool & dev server
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **React Context** - State management
- **CSS3** - Custom styling
- **JavaScript ES6+** - Programming language

## ✨ Tính năng nổi bật

### 🎯 Responsive Design
- Grid layout thích ứng: 6 cột (desktop) → 2 cột (mobile)
- Navigation thay đổi: Top navbar → Bottom navigation
- Typography và spacing tối ưu cho từng màn hình

### 🎨 Theme System
- Light/Dark mode với localStorage persistence
- Custom color palette với màu chủ đạo #ff6b6b
- Glass morphism effect cho auth pages
- Gradient backgrounds và smooth transitions

### 🔐 Authentication System
- Mock authentication cho development
- Role-based access control
- Protected routes với redirect logic
- Form validation và error handling

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 Giấy phép

Dự án được cấp phép theo Apache License 2.0.