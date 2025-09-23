import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  Plus,
  Minus,
} from "lucide-react";
import { foodApi } from "@/services/foodApi";
import { cartApi } from "@/services/cartApi";
import { toast } from "sonner";
import { reviewApi } from "@/services/reviewApi";
import useAuth from "@/hooks/useAuth";

const FoodDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewPagination, setReviewPagination] = useState({
    page: 1,
    has_next: false,
  });
  const [creatingReview, setCreatingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const { isCustomer } = useAuth();

  // Lấy chi tiết món ăn
  const fetchFoodDetail = async () => {
    try {
      const response = await foodApi.getFoodDetail(id);
      if (response.success) {
        setFood(response.data);
      }
    } catch (error) {
      console.error("Error fetching food detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodDetail();
    // Load first page of reviews
    (async () => {
      try {
        const res = await reviewApi.getFoodReviews(id, {
          page: 1,
          per_page: 5,
        });
        if (res.success) {
          setReviews(res.data?.items || []);
          const p = res.data?.pagination || {};
          setReviewPagination({
            page: p.page || 1,
            has_next: typeof p.has_next === "boolean" ? p.has_next : false,
          });
        }
      } catch (_) { }
    })();
  }, [id]);

  // Xử lý topping selection
  const toggleTopping = (topping) => {
    setSelectedToppings((prev) =>
      prev.find((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  // Tính tổng giá
  const calculateTotal = () => {
    const basePrice = food?.price || 0;
    const toppingsPrice = selectedToppings.reduce(
      (sum, topping) => sum + topping.price,
      0
    );
    return (basePrice + toppingsPrice) * quantity;
  };
  // Confirm add to cart (after toppings selection)
  const confirmAddToCart = async () => {
    try {
      const payload = {
        food_id: food.id,
        quantity,
        topping_ids: selectedToppings.map((t) => t.id),
      };

      // Enforce single-restaurant cart
      try {
        const currentCartRes = await cartApi.getCart();
        const currentRestaurantId = currentCartRes?.data?.restaurant_id;
        if (
          currentRestaurantId &&
          food?.restaurant?.id &&
          currentRestaurantId !== food.restaurant.id
        ) {
          const ok = window.confirm(
            "Giỏ hàng hiện tại là của quán khác. Xóa giỏ hàng cũ và thêm món này?"
          );
          if (!ok) return;
          await cartApi.clearCart();
        }
      } catch (_) {
        // ignore cart fetch errors
      }

      await cartApi.addToCart(payload);
      toast.success("Đã thêm vào giỏ hàng");
      // Trigger cart update event
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      setShowToppingModal(false);
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Không thể thêm vào giỏ hàng");
    }
  };

  // Handle primary Add to Cart button
  const handleAddToCart = () => {
    if (food?.toppings && food.toppings.length > 0) {
      setShowToppingModal(true);
      return;
    }
    // No toppings -> add directly
    confirmAddToCart();
  };

  const submitReview = async () => {
    try {
      setCreatingReview(true);
      await reviewApi.createCustomerReview({
        food_id: Number(id),
        rating: Number(newReview.rating),
        comment: newReview.comment,
      });
      // Reload reviews after submit
      const res = await reviewApi.getFoodReviews(id, { page: 1, per_page: 5 });
      if (res.success) {
        setReviews(res.data?.items || []);
      }
      setNewReview({ rating: 5, comment: "" });
    } catch (e) {
      toast.error(e.message || "Không thể gửi đánh giá");
    } finally {
      setCreatingReview(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
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
          <Button onClick={() => navigate("/")} className="mt-4">
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
                <Badge
                  className="absolute top-4 left-4 cursor-pointer hover:bg-primary/80"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(food.categories[0])}`)}
                >
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
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={() => navigate(`/search?q=${encodeURIComponent(category)}`)}
                        >
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
                  <CardTitle 
                    className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/restaurant/${food.restaurant.id}`)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={food.restaurant.image_url}
                        alt={food.restaurant.name}
                      />
                    </Avatar>
                    {food.restaurant.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Link className="" to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(food.restaurant.address)}`} target="_blank" rel="noopener noreferrer">
                      <span>{food.restaurant.address}</span>
                    </Link>
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

            {food.toppings && food.toppings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Toppings tùy chọn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {food.toppings.map((topping) => (
                      <div key={topping.id} className="flex items-center justify-between py-2">
                        <span className="font-medium">{topping.name}</span>
                        <span className="text-muted-foreground">{formatPrice(topping.price)}₫</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" /> Đánh giá món ăn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing reviews */}
                <div className="space-y-3">
                  {reviews.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Chưa có đánh giá nào
                    </p>
                  )}
                  {reviews.map((r) => (
                    <div key={r.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          {r.customer_name || "Người dùng"}
                        </div>
                        <div className="text-yellow-600">
                          {"★".repeat(r.rating)}
                          {"☆".repeat(5 - r.rating)}
                        </div>
                      </div>
                      {r.comment && <p className="text-sm mt-1">{r.comment}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(r.created_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Create review (customers only) */}
                {isCustomer && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Chọn sao:</span>
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={newReview.rating}
                        onChange={(e) =>
                          setNewReview((prev) => ({
                            ...prev,
                            rating: Number(e.target.value),
                          }))
                        }
                      >
                        {[5, 4, 3, 2, 1].map((v) => (
                          <option key={v} value={v}>
                            {v} sao
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      className="w-full border rounded p-2 text-sm"
                      rows={3}
                      placeholder="Chia sẻ cảm nhận của bạn..."
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                    />
                    <Button
                      disabled={creatingReview}
                      onClick={submitReview}
                      className="w-full"
                    >
                      {creatingReview ? "Đang gửi..." : "Gửi đánh giá"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Bạn chỉ có thể đánh giá nếu đã mua món này.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Topping Modal */}
        <Dialog open={showToppingModal} onOpenChange={setShowToppingModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chọn topping</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {food?.toppings?.map((topping) => (
                <div
                  key={topping.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedToppings.some(
                        (t) => t.id === topping.id
                      )}
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
            </div>
            <div className="mt-4 space-y-3">
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
              <div className="flex items-center justify-between">
                <span className="font-medium">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(calculateTotal())}₫
                </span>
              </div>
              <Button className="w-full" size="lg" onClick={confirmAddToCart}>
                Xác nhận thêm vào giỏ hàng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FoodDetailPage;
