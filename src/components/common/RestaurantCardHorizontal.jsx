import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const RestaurantCardHorizontal = ({ restaurant, onClick }) => {
  return (
    <Card className="cursor-pointer py-2" onClick={onClick}>
      <CardContent className="px-4 flex items-center gap-4">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-20 h-20 rounded object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{restaurant.name}</div>
          <div className="text-sm text-muted-foreground truncate">{restaurant.address}</div>
          <span className="text-sm text-muted-foreground">Cách {restaurant.distance_km} km</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCardHorizontal;


