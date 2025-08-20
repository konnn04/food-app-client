import React, { useState } from 'react';
import FoodCard from '../../components/common/FoodCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

// Mock data
const mockFoods = [
  {
    id: 1,
    name: 'Bún bò Huế',
    description: 'Bún bò Huế đậm đà, cay nồng với thịt bò tươi ngon',
    price: 45000,
    image: 'https://konya007.github.io/image-library/food/0.jpg',
    rating: 4.8,
    reviews: 124,
    category: 'Món chính',
    isAvailable: true
  },
  {
    id: 2,
    name: 'Phở gà',
    description: 'Phở gà nóng hổi với nước dàn ngọt, thịt gà mềm',
    price: 40000,
    image: 'https://konya007.github.io/image-library/food/1.jpg',
    rating: 4.6,
    reviews: 89,
    category: 'Món chính',
    isAvailable: true
  },
  {
    id: 3,
    name: 'Bánh mì pate',
    description: 'Bánh mì giòn với pate thơm ngon và rau sống',
    price: 15000,
    image: 'https://konya007.github.io/image-library/food/2.jpg',
    rating: 4.3,
    reviews: 56,
    category: 'Ăn sáng',
    isAvailable: false
  },
];

const categories = ['Tất cả', 'Món chính', 'Ăn sáng', 'Thức uống', 'Tráng miệng'];

export default function CustomerHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (food) => {
    setCartCount(prev => prev + 1);
    console.log('Added to cart:', food);
    // TODO: Add to cart logic
  };

  const filteredFoods = mockFoods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Chào mừng đến với FoodApp</h1>
        <p className="text-gray-600">Khám phá những món ăn ngon nhất trong khu vực</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Tìm kiếm món ăn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Category Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Button variant="ghost" size="sm" className="shrink-0">
          <Filter className="h-4 w-4 mr-1" />
          Lọc
        </Button>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer shrink-0"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFoods.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredFoods.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy món ăn nào</p>
        </div>
      )}
    </div>
  );
}