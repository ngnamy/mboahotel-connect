import React, { useState } from 'react';
import { DEFAULT_IMAGES } from '../utils/images';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackType?: 'hotel' | 'room' | 'city' | 'avatar';
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackType = 'hotel',
  width,
  height,
  loading = 'lazy'
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const getFallbackImage = () => {
    switch (fallbackType) {
      case 'hotel':
        return DEFAULT_IMAGES.hotel;
      case 'room':
        return DEFAULT_IMAGES.room;
      case 'city':
        return DEFAULT_IMAGES.city;
      case 'avatar':
        return DEFAULT_IMAGES.avatar;
      default:
        return DEFAULT_IMAGES.hotel;
    }
  };

  const optimizeImageUrl = (url: string) => {
    if (url.includes('unsplash.com') && width && height) {
      return `${url.split('?')[0]}?w=${width}&h=${height}&fit=crop&crop=center&auto=format&q=80`;
    }
    return url;
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Chargement...</div>
        </div>
      )}
      
      <img
        src={hasError ? getFallbackImage() : optimizeImageUrl(src)}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
        width={width}
        height={height}
      />
    </div>
  );
};

export default OptimizedImage;