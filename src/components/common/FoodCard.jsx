/* eslint-disable no-unused-vars */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, MapPin } from 'lucide-react';

export default function FoodCard({ 
  food, 
  onAddToCart, 
  showAddButton = true,
  onClick,
  className = ''
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
    categories = [],
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
      className={`overflow-hidden cursor-pointer hover:shadow-lg transition-shadow p-2 gap-2 ${!available ? 'opacity-60' : ''} ${className}`}
      onClick={() => onClick && onClick(food)}
    >
      {/* Food Image */}
      <div className="relative">
        <img 
          src={image_url || '/placeholder-food.jpg'} 
          alt={name}
          className="aspect-square w-full object-cover rounded"
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

      <CardContent className="p-2">
        {/* Food Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <h6 className="text-sm text-gray-600 line-clamp-2">{restaurant?.name}</h6>
          {/* Distance */}
          {distance_km && (
            <div className="text-sm text-gray-500">
              <MapPin className="inline-block mr-1 h-4 w-4" />
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
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}