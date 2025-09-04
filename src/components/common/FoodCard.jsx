import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, MapPin } from 'lucide-react';

export default function FoodCard({ 
  food, 
  onAddToCart, 
  showAddButton = true,
  onClick
}) {
  const {
    id,
    name,
    description,
    price,
    image_url,
    distance_km,
    restaurant,
    available,
    categories = []
  } = food;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  return (
    <Card 
      className={`overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${!available ? 'opacity-60' : ''}`}
      onClick={() => onClick && onClick(food)}
    >
      {/* Food Image */}
      <div className="relative">
        <img 
          src={image_url || '/placeholder-food.jpg'} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        {categories.length > 0 && (
          <Badge className="absolute top-2 left-2">
            {categories[0]}
          </Badge>
        )}
        {!available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium">Hết hàng</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Food Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          {/* <p className="text-gray-600 text-sm line-clamp-2">{description}</p> */}
          
          {/* Restaurant Info */}
          {restaurant && (
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{restaurant.name}</span>
            </div>
          )}

          {/* Distance */}
          {distance_km && (
            <div className="text-sm text-gray-500">
              Cách {formatDistance(distance_km)}
            </div>
          )}

          {/* Price and Add Button */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatPrice(price)}₫
            </span>
            {showAddButton && available && (
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart && onAddToCart(food);
                }}
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