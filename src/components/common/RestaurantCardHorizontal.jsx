import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const RestaurantCardHorizontal = ({ restaurant, onClick }) => {
  return (
    <Card className="cursor-pointer" onClick={onClick}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{restaurant.name}</div>
          <div className="text-sm text-muted-foreground truncate">{restaurant.address}</div>
        </div>
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-20 h-20 rounded object-cover"
        />
      </CardContent>
    </Card>
  );
};

export default RestaurantCardHorizontal;


