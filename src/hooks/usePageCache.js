import { useEffect, useRef } from 'react';

export const usePageCache = (cacheKey) => {
  const restoredRef = useRef(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(`cache:${cacheKey}`);
    if (saved && !restoredRef.current) {
      const { scrollY } = JSON.parse(saved);
      window.scrollTo(0, scrollY || 0);
      restoredRef.current = true;
    }
    const onSave = () => {
      sessionStorage.setItem(
        `cache:${cacheKey}`,
        JSON.stringify({ scrollY: window.scrollY })
      );
    };
    window.addEventListener('pagehide', onSave);
    return () => {
      onSave();
      window.removeEventListener('pagehide', onSave);
    };
  }, [cacheKey]);
};


