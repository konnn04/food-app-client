import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { staffApi } from '@/services/staffApi';
import InfiniteScroller from '@/components/common/InfiniteScroller';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

const StaffMenuPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, has_next: false });
  const [q, setQ] = useState('');

  const load = async (page = 1, append = false) => {
    try {
      setLoading(true);
      const res = await staffApi.getFoods({ q, page, per_page: 10 });
      if (res.success) {
        const list = res.data?.items || res.data || [];
        setItems((prev) => append ? [...prev, ...list] : list);
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

  const toggle = async (id) => {
    await staffApi.toggleFood(id);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Xoá món này?')) return;
    await staffApi.deleteFood(id);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Thực đơn</h1>
        <Button onClick={() => navigate('/staff/menu/new')}>Thêm món</Button>
      </div>

      <div className="flex gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên" />
        <Button onClick={load}>Tìm</Button>
      </div>

      {loading && <div className="text-muted-foreground">Đang tải...</div>}
      <InfiniteScroller hasMore={pagination.has_next} loading={loading} onLoadMore={loadMore}>
      <div className="space-y-3">
        {items.map((f) => (
          <Card key={f.id} className="hover:shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <img src={f.image_url} alt={f.name} className="w-16 h-16 rounded object-cover" />
              <div className="flex-1">
                <div className="font-medium">{f.name}</div>
                <div className="text-sm text-muted-foreground">{new Intl.NumberFormat('vi-VN').format(f.price)}₫</div>
              </div>
              <Badge variant={f.available ? 'default' : 'secondary'}>
                {f.available ? 'Đang bán' : 'Tạm ngừng'}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/staff/menu/${f.id}`)}>Sửa</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggle(f.id)}>{f.available ? 'Tắt' : 'Bật'}</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => remove(f.id)}>Xoá</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && !loading && (
          <div className="text-muted-foreground">Chưa có món nào</div>
        )}
      </div>
      </InfiniteScroller>
    </div>
  );
};

export default StaffMenuPage;


