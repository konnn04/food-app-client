import React from 'react';
import { cn } from '@/lib/utils';

export default function HamburgerLoader({ className, size = "default" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    default: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const hamburgerSizes = {
    sm: "w-4 h-3",
    default: "w-6 h-4",
    lg: "w-8 h-5"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        {/* Spinning circle */}
        <div 
          className={cn(
            "border-2 border-primary/20 border-t-primary rounded-full animate-spin",
            sizeClasses[size]
          )}
        />
        
        {/* Hamburger icon in center */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center animate-pulse",
            hamburgerSizes[size]
          )}
        >
          <div className="flex flex-col justify-between h-full w-full">
            <div className="h-0.5 bg-primary rounded-full animate-zoom-pulse" />
            <div className="h-0.5 bg-primary rounded-full animate-zoom-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="h-0.5 bg-primary rounded-full animate-zoom-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}