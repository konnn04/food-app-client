import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { staffApi } from '@/services/staffApi';

const StaffRestaurantSettings = () => {
  const [data, setData] = useState({ name: '', address: '', phone: '', email: '', description: '', opening_hours: '', cover_url: '', logo_url: '' });
  const [files, setFiles] = useState({ cover: null, logo: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [needsCreate, setNeedsCreate] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await staffApi.getRestaurant();
        if (res.success) {
          const r = res.data || {};
          setData({
            name: r.name || '',
            address: r.address || '',
            phone: r.phone || '',
            email: r.email || '',
            description: r.description || '',
            opening_hours: r.opening_hours || '',
            cover_url: r.cover_url || '',
            logo_url: r.logo_url || '',
          });
          setNeedsCreate(false);
        }
      } catch (e) {
        // If 403 not linked, show creation form
        setNeedsCreate(true);
      } finally { setLoading(false); }
    })();
  }, []);

  const saveInfo = async () => {
    setSaving(true);
    try {
      let payload = data;
      if (files.cover || files.logo) {
        const fd = new FormData();
        fd.append('name', data.name);
        fd.append('address', data.address);
        fd.append('phone', data.phone);
        fd.append('email', data.email);
        fd.append('description', data.description || '');
        fd.append('opening_hours', data.opening_hours || '');
        if (files.cover) fd.append('cover', files.cover);
        if (files.logo) fd.append('logo', files.logo);
        payload = fd;
      }
      await staffApi.updateRestaurant(payload);
    } finally { setSaving(false); }
  };

  const saveHours = async () => {
    setSaving(true);
    try {
      await staffApi.updateOpeningHours({ opening_hours: data.opening_hours });
    } finally { setSaving(false); }
  };

  const toggleActive = async () => {
    await staffApi.toggleRestaurant();
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-6 text-muted-foreground">Đang tải...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {needsCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Tạo nhà hàng của bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Tên" value={data.name} onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))} />
            <Input placeholder="Địa chỉ" value={data.address} onChange={(e) => setData((p) => ({ ...p, address: e.target.value }))} />
            <Input placeholder="SĐT" value={data.phone} onChange={(e) => setData((p) => ({ ...p, phone: e.target.value }))} />
            <Input placeholder="Email" value={data.email} onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))} />
            <Textarea rows={4} placeholder="Mô tả" value={data.description} onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-sm font-medium">Ảnh bìa</div>
                <Input type="file" accept="image/*" onChange={(e) => setFiles((p) => ({ ...p, cover: e.target.files?.[0] || null }))} />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Logo</div>
                <Input type="file" accept="image/*" onChange={(e) => setFiles((p) => ({ ...p, logo: e.target.files?.[0] || null }))} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={async () => { setSaving(true); try { const fd = new FormData(); fd.append('name', data.name); fd.append('address', data.address); fd.append('phone', data.phone); fd.append('email', data.email); fd.append('description', data.description || ''); fd.append('opening_hours', data.opening_hours || ''); if (files.cover) fd.append('cover', files.cover); if (files.logo) fd.append('logo', files.logo); await staffApi.createRestaurant(fd); setNeedsCreate(false); } finally { setSaving(false); } }} disabled={saving}>{saving ? 'Đang tạo...' : 'Tạo nhà hàng'}</Button>
            </div>
          </CardContent>
        </Card>
      )}
      {!needsCreate && (
      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhà hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.cover_url || files.cover) && (
            <img src={files.cover ? URL.createObjectURL(files.cover) : data.cover_url} alt="cover" className="w-full h-40 object-cover rounded" />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">Ảnh bìa</div>
              <Input type="file" accept="image/*" onChange={(e) => setFiles((p) => ({ ...p, cover: e.target.files?.[0] || null }))} />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Logo</div>
              <Input type="file" accept="image/*" onChange={(e) => setFiles((p) => ({ ...p, logo: e.target.files?.[0] || null }))} />
            </div>
          </div>
          {(data.logo_url || files.logo) && (
            <img src={files.logo ? URL.createObjectURL(files.logo) : data.logo_url} alt="logo" className="w-20 h-20 object-cover rounded-full" />
          )}
          <Input placeholder="Tên" value={data.name} onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))} />
          <Input placeholder="Địa chỉ" value={data.address} onChange={(e) => setData((p) => ({ ...p, address: e.target.value }))} />
          <Input placeholder="SĐT" value={data.phone} onChange={(e) => setData((p) => ({ ...p, phone: e.target.value }))} />
          <Input placeholder="Email" value={data.email} onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))} />
          <Textarea rows={4} placeholder="Mô tả" value={data.description} onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))} />
          <div className="flex justify-end">
            <Button onClick={saveInfo} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
          </div>
        </CardContent>
      </Card>
      )}

      {!needsCreate && (
      <Card>
        <CardHeader>
          <CardTitle>Giờ mở cửa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea rows={3} placeholder="Giờ mở cửa" value={data.opening_hours} onChange={(e) => setData((p) => ({ ...p, opening_hours: e.target.value }))} />
          <div className="flex gap-2 justify-between">
            <Button variant="outline" onClick={toggleActive}>Bật/Tắt hoạt động</Button>
            <Button onClick={saveHours} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu giờ'}</Button>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default StaffRestaurantSettings;


