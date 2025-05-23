import React from 'react';

const Skeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export default Skeleton;
