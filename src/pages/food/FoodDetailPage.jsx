import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Checkbox } from '../../components/ui/checkbox';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Star,
  Plus,
  Minus
} from 'lucide-react';
import { foodApi } from '../../services/foodApi';
import { cartApi } from '../../services/cartApi';

const FoodDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Lấy chi tiết món ăn
  const fetchFoodDetail = async () => {
    try {
      const response = await foodApi.getFoodDetail(id);
      if (response.success) {
        setFood(response.data);
      }
    } catch (error) {
      console.error('Error fetching food detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodDetail();
  }, [id]);

  // Xử lý topping selection
  const toggleTopping = (topping) => {
    setSelectedToppings(prev => 
      prev.find(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  // Tính tổng giá
  const calculateTotal = () => {
    const basePrice = food?.price || 0;
    const toppingsPrice = selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
    return (basePrice + toppingsPrice) * quantity;
  };
  // Add to cart
  const handleAddToCart = async () => {
    try {
      const payload = {
        food_id: food.id,
        quantity,
        topping_ids: selectedToppings.map(t => t.id),
      };
      await cartApi.addToCart(payload);
      navigate('/cart');
    } catch (e) {
      console.error(e);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Format distance
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Không tìm thấy món ăn</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <h1 className="text-lg font-semibold line-clamp-1">{food.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image and Info */}
          <div className="space-y-6">
            {/* Food Image */}
            <div className="relative">
              <img
                src={food.image_url}
                alt={food.name}
                className="w-full h-80 object-cover rounded-lg"
              />
              {food.categories.length > 0 && (
                <Badge className="absolute top-4 left-4">
                  {food.categories[0]}
                </Badge>
              )}
            </div>

            {/* Food Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{food.name}</CardTitle>
                <p className="text-muted-foreground">{food.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Categories */}
                {food.categories.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Danh mục</h4>
                    <div className="flex flex-wrap gap-2">
                      {food.categories.map((category, index) => (
                        <Badge key={index} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div>
                  <h4 className="font-medium mb-2">Giá</h4>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(food.price)}₫
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Restaurant and Order */}
          <div className="space-y-6">
            {/* Restaurant Info */}
            {food.restaurant && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {food.restaurant.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{food.restaurant.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{food.restaurant.opening_hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{food.restaurant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{food.restaurant.email}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Toppings */}
            {food.toppings && food.toppings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Toppings tùy chọn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {food.toppings.map((topping) => (
                    <div
                      key={topping.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedToppings.some(t => t.id === topping.id)}
                          onCheckedChange={() => toggleTopping(topping)}
                        />
                        <div>
                          <p className="font-medium">{topping.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(topping.price)}₫
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Order Section */}
            <Card>
              <CardHeader>
                <CardTitle>Đặt hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Số lượng</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Tổng cộng</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(calculateTotal())}₫
                  </span>
                </div>

                {/* Add to Cart Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!food.available}
                  onClick={handleAddToCart}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm vào giỏ hàng
                </Button>

                {!food.available && (
                  <p className="text-destructive text-sm text-center">
                    Món ăn này hiện không khả dụng
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPage;
