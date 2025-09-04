import React, { useEffect } from 'react';

const InfiniteScroller = ({ hasMore, loading, onLoadMore, offset = 100 }) => {
  useEffect(() => {
    if (!hasMore || loading) return;
    const handle = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= documentHeight - offset) {
        onLoadMore && onLoadMore();
      }
    };
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, [hasMore, loading, onLoadMore, offset]);

  return null;
};

export default InfiniteScroller;


