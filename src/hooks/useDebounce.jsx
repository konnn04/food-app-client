import { useEffect, useState } from 'react';

// Simple debounce hook for any value
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// Debounced callback
export function useDebouncedCallback(callback, delay = 400, deps = []) {
  useEffect(() => {
    const id = setTimeout(() => {
      callback();
    }, delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}


