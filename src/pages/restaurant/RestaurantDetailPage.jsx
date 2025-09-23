import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { restaurantApi } from '../../services/restaurantApi';
import { foodApi } from '../../services/foodApi';
import FoodCard from '../../components/common/FoodCard';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Star, MapPin, Clock, Phone, Mail, ArrowLeft } from 'lucide-react';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [foods, setFoods] = useState([]);
  const [relatedRestaurants, setRelatedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch restaurant details
        const restaurantRes = await restaurantApi.getRestaurantDetail(id);
        setData(restaurantRes.data);
        
        // Fetch foods from this restaurant
        const foodsRes = await foodApi.getFoods({ restaurant_id: id, per_page: 20 });
        if (foodsRes.success) {
          setFoods(foodsRes.data.items || []);
        }
        
        // Fetch related restaurants
        try {
          const relatedRes = await restaurantApi.getRandomRestaurants({ 
            per_page: 4
          });
          if (relatedRes.success) {
            setRelatedRestaurants(relatedRes.data.items.filter(r => r.id !== parseInt(id)) || []);
          }
        } catch (error) {
          console.error("Error fetching related restaurants:", error);
        }
      } catch (e) {
        console.error("Error loading restaurant data:", e);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  
  if (!data) return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Không tìm thấy nhà hàng</h2>
      <Button onClick={() => navigate(-1)}>Quay lại</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Back button header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <h1 className="text-lg font-semibold line-clamp-1">{data.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Restaurant Header */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <img 
            src={data.image_url} 
            alt={data.name} 
            className="w-full md:w-64 h-64 object-cover rounded-lg"
          />
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{data.name}</h1>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex text-yellow-500">
                  {"★".repeat(Math.floor(data.avg_rating || 0))}
                  {"☆".repeat(5 - Math.floor(data.avg_rating || 0))}
                </div>
                <span className="text-sm font-medium">{data.avg_rating?.toFixed(1) || 0}</span>
                <span className="text-sm text-muted-foreground">({data.review_count || 0} đánh giá)</span>
              </div>
            </div>
            
            <p className="text-muted-foreground">{data.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Link to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`} target="_blank" rel="noopener noreferrer">
                    <span>{data.address}</span>
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{data.opening_hours}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{data.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{data.email}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Món: {data.food_count}</Badge>
              <Badge variant="outline">Đơn hoàn thành: {data.completed_orders}</Badge>
              {data.is_active ? (
                <Badge variant="default">Đang hoạt động</Badge>
              ) : (
                <Badge variant="secondary">Tạm ngừng</Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Popular foods section if available */}
        {data.top_foods && data.top_foods.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Món ăn nổi bật</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.top_foods.map(food => (
                <Card key={food.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/food/${food.id}`)}>
                  <div className="relative aspect-video">
                    <img src={food.image_url} alt={food.name} className="w-full h-full object-cover rounded-t-lg" />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium line-clamp-1">{food.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-primary font-semibold">{formatPrice(food.price)}₫</p>
                      <span className="text-sm text-muted-foreground">Đã bán: {food.total_sold}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Recent reviews section */}
        {data.recent_reviews && data.recent_reviews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Đánh giá gần đây</h2>
            <div className="space-y-3">
              {data.recent_reviews.map(review => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Khách hàng #{review.customer_id}</div>
                      <div className="flex text-yellow-500">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    {review.comment && <p className="mt-2">{review.comment}</p>}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.created_at).toLocaleString("vi-VN")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* All foods from this restaurant */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Thực đơn</h2>
          {foods.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {foods.map(food => (
                <FoodCard 
                  key={food.id} 
                  food={food} 
                  showAddButton={true} 
                  onClick={() => navigate(`/food/${food.id}`)} 
                />
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">Không có món ăn nào</p>
          )}
        </div>
        
        {/* Related restaurants section */}
        {relatedRestaurants.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Nhà hàng tương tự</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedRestaurants.map(restaurant => (
                <Card 
                  key={restaurant.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                >
                  <div className="relative aspect-video">
                    <img 
                      src={restaurant.image_url} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover rounded-t-lg" 
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium line-clamp-1">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{restaurant.avg_rating?.toFixed(1) || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{restaurant.address}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetailPage;


