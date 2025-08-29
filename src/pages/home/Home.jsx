import React from 'react';
import useAuth from '@/hooks/useAuth';
import CustomerHome from './CustomerHome';
import StaffHome from './StaffHome';

export default function Home() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // Render different home based on user role
  if (currentUser.role === 'customer') {
    return <CustomerHome />;
  } else if (currentUser.role === 'staff' || currentUser.role === 'owner') {
    return <StaffHome />;
  }

  return <div>Unknown user role</div>;
}