import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext.jsx';

export default function useAuth() {
  return useContext(AuthContext);
}