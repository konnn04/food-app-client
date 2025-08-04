import { useState, useEffect } from 'react';
import { BG_LENGTH } from '../utils/constants';

export const useRandomBackground = () => {
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const randomBg = Math.floor(Math.random() * BG_LENGTH); 
    const bgPath = `/src/assets/bg/${randomBg}.jpg`;
    setBackgroundImage(bgPath);
  }, []);

  return backgroundImage;
};


