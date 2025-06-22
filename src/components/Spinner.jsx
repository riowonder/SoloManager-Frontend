import React from "react";

export default function Spinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute w-full h-full border-2 border-gray-200 rounded-full"></div>
        <div className="absolute w-full h-full border-2 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

// Skeleton loader component for content
export function SkeletonLoader({ className = "", lines = 1 }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-4 bg-gray-200 rounded mb-2"></div>
      ))}
    </div>
  );
}

// Card skeleton loader
export function CardSkeleton({ className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 animate-pulse ${className}`}>
      <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        <div className="h-4 bg-gray-200 rounded w-3/6"></div>
      </div>
    </div>
  );
}

// Table skeleton loader
export function TableSkeleton({ rows = 5, className = "" }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 bg-gray-100 rounded mb-2"></div>
      ))}
    </div>
  );
}
