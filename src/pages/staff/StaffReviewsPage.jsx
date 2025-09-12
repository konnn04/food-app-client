import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { reviewApi } from '@/services/reviewApi';
import InfiniteScroller from '@/components/common/InfiniteScroller';

const StaffReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, has_next: false });
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');

  const load = async (page = 1, append = false) => {
    try {
      setLoading(true);
      const res = await reviewApi.getStaffRestaurantReviews({ page, per_page: 10, q });
      if (res.success) {
        const items = res.data?.items || [];
        setReviews((prev) => append ? [...prev, ...items] : items);
        const p = res.data?.pagination || {};
        setPagination({ page: p.page || page, has_next: !!p.has_next });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [q]);

  const loadMore = useCallback(() => {
    if (!loading && pagination.has_next) {
      load((pagination.page || 1) + 1, true);
    }
  }, [loading, pagination]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold">Đánh giá của khách hàng</h1>
      {loading && <div className="text-muted-foreground">Đang tải...</div>}
      <InfiniteScroller hasMore={pagination.has_next} loading={loading} onLoadMore={loadMore}>
      <div className="space-y-3">
        {reviews.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.customer_name || 'Người dùng'}</div>
                <div className="text-yellow-600">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              </div>
              {r.food_name && (
                <div className="text-sm text-muted-foreground mt-0.5">Món: {r.food_name}</div>
              )}
              {r.comment && <p className="text-sm mt-2">{r.comment}</p>}
              <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleString('vi-VN')}</p>
            </CardContent>
          </Card>
        ))}
        {reviews.length === 0 && !loading && (
          <div className="text-muted-foreground">Chưa có đánh giá nào</div>
        )}
      </div>
      </InfiniteScroller>
    </div>
  );
};

export default StaffReviewsPage;


