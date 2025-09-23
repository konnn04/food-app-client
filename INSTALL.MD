# Hướng dẫn cài đặt Food App Client

## Yêu cầu hệ thống

- Node.js (v16 hoặc cao hơn)
- npm hoặc yarn
- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)

## Cài đặt môi trường phát triển

### 1. Clone dự án từ GitHub

```bash
git clone https://github.com/your-username/food-app-client.git
cd food-app-client
```

### 2. Cài đặt các phụ thuộc

```bash
npm install
```

hoặc nếu bạn sử dụng yarn:

```bash
yarn install
```

### 3. Cấu hình môi trường

Tạo file .env trong thư mục gốc của dự án với nội dung sau:

```
VITE_API_URL=http://localhost:8000
```

*Lưu ý: Thay đổi URL API tùy thuộc vào cấu hình backend của bạn.*

### 4. Khởi chạy ứng dụng trong môi trường phát triển

```bash
npm run dev
```

Ứng dụng sẽ chạy tại [http://localhost:5173](http://localhost:5173)

## Triển khai lên môi trường production

### Cách 1: Build và triển khai thủ công

1. Build ứng dụng:

```bash
npm run build
```

2. Kết quả build sẽ được lưu trong thư mục `dist/`, bạn có thể triển khai thư mục này lên bất kỳ web server nào (Nginx, Apache, etc.)

### Cách 2: Triển khai trên Vercel

1. Cài đặt Vercel CLI:

```bash
npm install -g vercel
```

2. Đăng nhập vào Vercel:

```bash
vercel login
```

3. Triển khai ứng dụng:

```bash
vercel
```

hoặc để triển khai lên môi trường production:

```bash
vercel --prod
```

### Cách 3: Sử dụng GitHub Actions

Dự án đã được cấu hình với GitHub Actions để tự động triển khai khi push code lên nhánh `dev`. Xem file deloy.yml để biết thêm chi tiết.

## Tài khoản demo

Để kiểm thử ứng dụng, bạn có thể sử dụng các tài khoản demo sau:

- **Nhân viên nhà hàng**: 
  - Email: staff@restaurant.com
  - Mật khẩu: 123456
  
- **Quản lý nhà hàng**:
  - Email: manager@restaurant.com 
  - Mật khẩu: 123456

## Xử lý sự cố

Nếu bạn gặp vấn đề khi cài đặt hoặc chạy ứng dụng, hãy thử các bước sau:

1. Xóa thư mục node_modules và file package-lock.json, sau đó cài đặt lại:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Kiểm tra phiên bản Node.js:
   ```bash
   node -v
   ```
   
3. Kiểm tra log lỗi trong console của trình duyệt hoặc terminal.

4. Tạo issue trên GitHub repository để được hỗ trợ.

## Tùy chỉnh cấu hình

### Cổng máy chủ
Để thay đổi cổng mặc định (5173), bạn có thể chỉnh sửa file vite.config.ts:

```ts
server: {
  port: YOUR_PORT_NUMBER,
  host: true
}
```

### Kết nối API
Đảm bảo API backend của bạn đang chạy và có thể truy cập từ ứng dụng client.