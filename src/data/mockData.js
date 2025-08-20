export const mockFoodItems = [
  {
    id: 1,
    name: 'Bánh mì thịt nướng',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=300&h=200&fit=crop',
    category: 'Bánh mì',
    rating: 4.5,
    description: 'Bánh mì thơm ngon với thịt nướng đậm đà'
  },
  {
    id: 2,
    name: 'Phở bò tái',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=300&h=200&fit=crop',
    category: 'Phở',
    rating: 4.8,
    description: 'Phở truyền thống với nước dùng thơm ngon'
  },
  {
    id: 3,
    name: 'Cơm tấm sườn nướng',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
    category: 'Cơm',
    rating: 4.6,
    description: 'Cơm tấm với sườn nướng thơm lừng'
  },
  {
    id: 4,
    name: 'Bún bò Huế',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1576113017802-986a4b3efe71?w=300&h=200&fit=crop',
    category: 'Bún',
    rating: 4.7,
    description: 'Bún bò Huế cay nồng đặc trưng'
  },
  {
    id: 5,
    name: 'Gà rán KFC',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300&h=200&fit=crop',
    category: 'Gà rán',
    rating: 4.3,
    description: 'Gà rán giòn tan, vị đậm đà'
  },
  {
    id: 6,
    name: 'Pizza Margherita',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop',
    category: 'Pizza',
    rating: 4.4,
    description: 'Pizza cổ điển với phô mai và cà chua'
  }
];

export const mockStaffUsers = {
  'staff@restaurant.com': { 
    id: 1,
    email: 'staff@restaurant.com',
    name: 'Nhân viên Demo',
    role: 'staff',
    password: '123456'
  },
  'manager@restaurant.com': { 
    id: 2,
    email: 'manager@restaurant.com',
    name: 'Quản lý Demo',
    role: 'manager',
    password: '123456'
  }
};
