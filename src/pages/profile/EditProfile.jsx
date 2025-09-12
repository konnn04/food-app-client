import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { userApi } from '@/services/userApi';
import useAuth from '@/hooks/useAuth';
import { toast } from '@/utils/toast';
import { ArrowLeft, Save, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const { currentUser } = useAuth();
  const role = useMemo(() => currentUser?.role || 'customer', [currentUser]);
  const navigate = useNavigate();

  const [form, setForm] = useState({ first_name: '', last_name: '', full_name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    userApi.getProfile(role).then((res) => {
      const p = res?.data || currentUser || {};
      const firstName = p.first_name || '';
      const lastName = p.last_name || '';
      const fallbackFull = p.full_name || p.name || `${firstName} ${lastName}`.trim();
      setForm({
        first_name: firstName,
        last_name: lastName,
        full_name: fallbackFull,
        email: p.email || '',
        phone: p.phone || '',
      });
    }).catch(() => {});
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = role === 'customer'
        ? { full_name: form.full_name, email: form.email, phone: form.phone }
        : { first_name: form.first_name, last_name: form.last_name, email: form.email, phone: form.phone, address: form.address };
      await userApi.updateProfile(role, payload);
      toast.success('Đã lưu thông tin');
      navigate('/profile');
    } catch (e) {
      toast.error(e.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại
        </Button>
        <h1 className="text-lg font-semibold">Chỉnh sửa hồ sơ</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ảnh đại diện</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-muted" />
            <div>
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <UploadCloud className="h-4 w-4" />
                <span>Chọn ảnh</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
              <div className="text-xs text-muted-foreground mt-1">Hỗ trợ JPG, PNG &lt; 2MB</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {role === 'customer' ? (
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground">Họ và tên</label>
                <Input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Nhập họ và tên" />
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm text-muted-foreground">Họ</label>
                  <Input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Nhập họ" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Tên</label>
                  <Input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Nhập tên" />
                </div>
              </>
            )}
            <div>
              <label className="text-sm text-muted-foreground">Số điện thoại</label>
              <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Nhập số điện thoại" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-muted-foreground">Email</label>
              <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Nhập email" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" /> Lưu thay đổi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
