import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, MapPin } from 'lucide-react';
import FoodCard from '../../components/common/FoodCard';
import LocationSetup from '../../components/common/LocationSetup';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { foodApi } from '../../services/foodApi';
import { restaurantApi } from '../../services/restaurantApi';
import { useLocation } from '../../hooks/useLocation';
import RestaurantCardHorizontal from '../../components/common/RestaurantCardHorizontal';

const CustomerHome = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showLocationSetup, setShowLocationSetup] = useState(false);
  const { location, getCurrentLocation } = useLocation();
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Danh sách từ khóa tìm kiếm phổ biến
  const popularKeywords = ['Phở', 'Bún', 'Cơm', 'Bánh mì', 'Hủ tiếu', 'Bánh cuốn'];

  // Lấy danh sách món ăn
  const fetchFoods = useCallback(async (page = 1, append = false) => {
    if (!location) {
      setShowLocationSetup(true);
      return;
    }

    setLoading(true);
    try {
      const params = {
        page,
        per_page: 10,
        lat: location.lat,
        lon: location.lon
      };

      if (searchQuery) {
        params.q = searchQuery;
      }

      if (selectedCategoryId) {
        params.category = selectedCategoryId;
      }

      const response = await foodApi.getFoods(params);
      
      if (response.success) {
        const newFoods = response.data.items;
        if (append) {
          setFoods(prev => [...prev, ...newFoods]);
        } else {
          setFoods(newFoods);
        }
        
        setHasMore(page < response.data.meta.total_pages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  }, [location, searchQuery, selectedCategoryId]);

  // Load more khi scroll
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;
    
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollTop + windowHeight >= documentHeight - 100) {
      fetchFoods(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, fetchFoods]);

  // Tìm kiếm
  const handleSearch = () => {
    if (searchQuery && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  // Tìm kiếm theo từ khóa
  const handleKeywordSearch = (keyword) => {
    setSearchQuery(keyword);
    setCurrentPage(1);
    setHasMore(true);
    fetchFoods(1, false);
  };

  // Xử lý khi location được set
  const handleLocationSet = (newLocation) => {
    setShowLocationSetup(false);
    fetchFoods(1, false);
  };

  // Xử lý click vào món ăn
  const handleFoodClick = (food) => {
    navigate(`/food/${food.id}`);
  };

  useEffect(() => {
    if (location) {
      fetchFoods(1, false);
      // Fetch categories
      foodApi.getCategories().then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      }).catch(() => {});
      // Fetch popular restaurants
      restaurantApi.getPublicRestaurants({ page: 1, per_page: 10, lat: location.lat, lon: location.lon }).then((res) => {
        const items = res?.data?.items || [];
        setRestaurants(items);
      }).catch(() => {});
    }
  }, [location]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCancelLocation = () => setShowLocationSetup(false);

  return (
    <div className="min-h-screen bg-background">
      <Dialog open={showLocationSetup} onOpenChange={setShowLocationSetup}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thiết lập địa chỉ</DialogTitle>
          </DialogHeader>
          <LocationSetup onLocationSet={handleLocationSet} onCancel={handleCancelLocation} />
        </DialogContent>
      </Dialog>
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Tìm kiếm món ăn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pr-10"
                />
                <Button
                  size="sm"
                  onClick={handleSearch}
                  className="absolute right-1 top-1"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowLocationSetup(true)}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Địa chỉ
            </Button>
          </div>
        </div>
      </div>

      {/* Location box */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Card>
          <CardContent className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Địa chỉ hiện tại</div>
                <div className="text-sm font-medium">
                  {location ? (location.address || `${location.lat.toFixed(5)}, ${location.lon.toFixed(5)}`) : 'Chưa thiết lập' }
                </div>
              </div>
            </div>
            <Button variant="secondary" onClick={() => setShowLocationSetup(true)}>Cập nhật</Button>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4">
        {categories.length > 0 && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">Danh mục</h3>
          </div>
        )}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Badge
              key="all"
              variant={selectedCategoryId ? 'secondary' : 'default'}
              className="whitespace-nowrap cursor-pointer"
              onClick={() => setSelectedCategoryId(null)}
            >
              Tất cả
            </Badge>
            {categories.map((c) => (
              <Badge
                key={c.id}
                variant={selectedCategoryId === c.id ? 'default' : 'secondary'}
                className="whitespace-nowrap cursor-pointer"
                onClick={() => navigate(`/search?q=${encodeURIComponent(c.name)}`)}
              >
                {c.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Popular Restaurants */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {restaurants.length > 0 && (
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold">Quán nổi tiếng gần bạn</h3>
          </div>
        )}
        {restaurants.length > 0 && (
          <div className="space-y-3">
            {restaurants.map((r) => (
              <RestaurantCardHorizontal key={r.id} restaurant={r} onClick={() => navigate(`/restaurant/${r.id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* Popular Keywords */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {popularKeywords.map((keyword) => (
            <Badge
              key={keyword}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleKeywordSearch(keyword)}
            >
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {foods.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onClick={handleFoodClick}
                showAddButton={true}
              />
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy món ăn nào</p>
          </div>
        ) : null}

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* No more data */}
        {!hasMore && foods.length > 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Đã hiển thị tất cả món ăn</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHome;