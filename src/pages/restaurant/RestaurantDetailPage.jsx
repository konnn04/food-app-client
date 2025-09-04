import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantApi } from '../../services/restaurantApi';
import FoodCard from '../../components/common/FoodCard';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await restaurantApi.getRestaurantDetail(id);
        setData(res.data);
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!data) return <div className="p-4">Không tìm thấy nhà hàng</div>;

  const foods = data.foods || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-start gap-4 mb-6">
        <img src={data.image_url} alt={data.name} className="w-28 h-28 rounded object-cover" />
        <div className="min-w-0">
          <h1 className="text-xl font-semibold truncate">{data.name}</h1>
          <div className="text-sm text-muted-foreground truncate">{data.address}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {foods.map(f => (
          <FoodCard key={f.id} food={f} showAddButton={true} onClick={(food) => navigate(`/food/${food.id}`)} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetailPage;


