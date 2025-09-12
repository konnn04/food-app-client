import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { staffApi } from '@/services/staffApi';

const StaffFoodEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new';
  const [form, setForm] = useState({ name: '', price: 0, description: '', image_url: '', image_file: null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      (async () => {
        const res = await staffApi.getFood(id);
        if (res.success) {
          const f = res.data;
          setForm({ name: f.name || '', price: f.price || 0, description: f.description || '', image_url: f.image_url || '' });
        }
      })();
    }
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      const hasFile = !!form.image_file;
      let payload = form;
      if (hasFile) {
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('price', String(form.price));
        fd.append('description', form.description || '');
        fd.append('image', form.image_file);
        payload = fd;
      }
      if (isNew) await staffApi.createFood(payload); else await staffApi.updateFood(id, payload);
      navigate('/staff/menu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? 'Thêm món mới' : 'Sửa món'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="text-sm font-medium">Tên món</div>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Giá (₫)</div>
            <Input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Mô tả</div>
            <Textarea rows={4} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">Ảnh</div>
            {(form.image_file || form.image_url) && (
              <img src={form.image_file ? URL.createObjectURL(form.image_file) : form.image_url} alt="preview" className="w-32 h-32 object-cover rounded" />
            )}
            <Input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, image_file: e.target.files?.[0] || null }))} />
            <div className="text-xs text-muted-foreground">Có thể chọn ảnh để tải lên (multipart/form-data) hoặc dùng URL ở dưới.</div>
            <Input placeholder="Hoặc dán URL ảnh" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => navigate('/staff/menu')}>Huỷ</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffFoodEditPage;


