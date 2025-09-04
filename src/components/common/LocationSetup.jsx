import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MapPin, Navigation, Search } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';

const LocationSetup = ({ onLocationSet, onCancel }) => {
  const [address, setAddress] = useState('');
  const [searching, setSearching] = useState(false);
  const { location, loading, error, getCurrentLocation, setLocationFromAddress } = useLocation();

  // Tìm kiếm địa chỉ qua Nominatim
  const searchAddress = async () => {
    if (!address.trim()) return;
    
    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        await setLocationFromAddress(parseFloat(lat), parseFloat(lon), display_name);
        if (onLocationSet) {
          onLocationSet({ lat: parseFloat(lat), lon: parseFloat(lon), address: display_name });
        }
      } else {
        alert('Không tìm thấy địa chỉ này');
      }
    } catch (error) {
      alert('Có lỗi khi tìm kiếm địa chỉ');
    } finally {
      setSearching(false);
    }
  };

  const handleGetCurrentLocation = () => {
    getCurrentLocation();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Thiết lập địa chỉ nhận hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tìm kiếm địa chỉ</label>
          <div className="flex gap-2">
            <Input
              placeholder="Nhập địa chỉ của bạn..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
            />
            <Button 
              onClick={searchAddress} 
              disabled={searching || !address.trim()}
              size="sm"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">hoặc</span>
        </div>

        <Button 
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="w-full"
          variant="outline"
        >
          <Navigation className="h-4 w-4 mr-2" />
          {loading ? 'Đang lấy vị trí...' : 'Lấy vị trí hiện tại'}
        </Button>

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>Hủy</Button>
          )}
        </div>

        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}

        {location && (
          <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400 p-2 rounded">
            ✓ Đã thiết lập vị trí: {location.address || `${location.lat.toFixed(6)}, ${location.lon.toFixed(6)}`}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSetup;
