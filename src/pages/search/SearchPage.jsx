import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Slider } from '../../components/ui/slider';
import { Search, Filter, MapPin, SortAsc, SortDesc } from 'lucide-react';
import FoodCard from '../../components/common/FoodCard';
import RestaurantCardHorizontal from '../../components/common/RestaurantCardHorizontal';
import InfiniteScroller from '../../components/common/InfiniteScroller';
import { searchApi } from '../../services/searchApi';
import { useLocation } from '../../hooks/useLocation';
import { usePageCache } from '../../hooks/usePageCache';

const SearchPage = () => {
  usePageCache('search');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { location } = useLocation();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'distance');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Categories from API response
  const allCategories = [
    'Đồ ăn vặt', 'Món chính', 'Tráng miệng', 'Món ăn nhanh', 
    'Món ăn đường phố', 'Mì'
  ];

  // Sort options
  const sortOptions = [
    { value: 'distance', label: 'Gần nhất' },
    { value: 'price', label: 'Giá' },
  ];

  // Lấy danh sách món ăn
  const fetchFoods = useCallback(async (page = 1, append = false) => {


    setLoading(true);
    try {
      const params = {
        page,
        per_page: 10,
      };

      if (location && typeof location.lat === 'number' && typeof location.lon === 'number') {
        params.lat = location.lat;
        params.lon = location.lon;
      }

      if (searchQuery) {
        params.q = searchQuery;
      }

      if (sortBy) {
        params.sort_by = sortBy;
        params.sort_order = 'asc';
      }

      if (priceRange[0] > 0) {
        params.min_price = priceRange[0];
      }
      if (priceRange[1] < 100000) {
        params.max_price = priceRange[1];
      }

      if (selectedCategories.length > 0) {
        params.categories = selectedCategories.join(',');
      }

      const response = await searchApi.search(params);
      
      if (response.success) {
        const restaurants = response.data.items || [];
        setResults(prev => (append ? [...prev, ...restaurants] : restaurants));
        const totalPages = response.data.pages || response.data.pagination?.total_pages || 1;
        setHasMore(page < totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  }, [location, searchQuery, sortBy, priceRange, selectedCategories, navigate]);

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
    setSearchParams({ q: searchQuery });
    setCurrentPage(1);
    setHasMore(true);
    fetchFoods(1, false);
  };

  // Xử lý filter
  const handleFilterChange = () => {
    setCurrentPage(1);
    setHasMore(true);
    fetchFoods(1, false);
  };

  // Xử lý category toggle
  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Xử lý click vào món ăn
  const handleFoodClick = (food) => {
    navigate(`/food/${food.id}`);
  };

  // Format price range
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  useEffect(() => {
    if (location) {
      fetchFoods(1, false);
    }
  }, [location]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    handleFilterChange();
  }, [sortBy, priceRange, selectedCategories]);

  return (
    <div className="min-h-screen bg-background">
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
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Bộ lọc
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sort */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sắp xếp</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Khoảng giá: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}₫
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100000}
                  step={1000}
                  className="w-full"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium mb-2 block">Danh mục</label>
                <div className="flex flex-wrap gap-1">
                  {allCategories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Kết quả tìm kiếm {searchQuery && `cho "${searchQuery}"`}
          </h2>
          <span className="text-sm text-muted-foreground">{results.length} nhà hàng</span>
        </div>

        {/* Grouped restaurants with foods */}
        {results.length > 0 ? (
          <div className="space-y-6">
            {results.map((r) => (
              <div key={r.id} className="rounded-lg border bg-card">
                <div className="p-4">
                  <RestaurantCardHorizontal restaurant={r} onClick={() => navigate(`/restaurant/${r.id}`)} />
                </div>
                <div className="px-4 pb-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {(r.searched_foods || []).map((food) => (
                    <FoodCard
                      key={`${r.id}-${food.id}`}
                      food={{ ...food, restaurant: r }}
                      onClick={handleFoodClick}
                      showAddButton={true}
                    />
                  ))}
                </div>
              </div>
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
        {!hasMore && results.length > 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Đã hiển thị tất cả món ăn</p>
          </div>
        )}
        <InfiniteScroller hasMore={hasMore} loading={loading} onLoadMore={() => fetchFoods(currentPage + 1, true)} />
      </div>
    </div>
  );
};

export default SearchPage;
