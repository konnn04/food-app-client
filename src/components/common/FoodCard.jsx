import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus } from 'lucide-react';

export default function FoodCard({ 
  food, 
  onAddToCart, 
  showAddButton = true 
}) {
  const {
    id,
    name,
    description,
    price,
    image,
    rating = 4.5,
    reviews = 0,
    category,
    isAvailable = true
  } = food;

  return (
    <Card className={`overflow-hidden ${!isAvailable ? 'opacity-60' : ''}`}>
      {/* Food Image */}
      <div className="relative">
        <img 
          src={image || '/placeholder-food.jpg'} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        {category && (
          <Badge className="absolute top-2 left-2">
            {category}
          </Badge>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium">Hết hàng</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Food Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
          
          {/* Rating */}
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-gray-500">({reviews} đánh giá)</span>
          </div>

          {/* Price and Add Button */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {price?.toLocaleString('vi-VN')}₫
            </span>
            {showAddButton && isAvailable && (
              <Button 
                size="sm" 
                onClick={() => onAddToCart(food)}
                className="ml-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}