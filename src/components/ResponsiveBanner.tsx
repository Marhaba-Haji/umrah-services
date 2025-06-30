import React, { useState } from "react";

interface ResponsiveBannerProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const ResponsiveBanner: React.FC<ResponsiveBannerProps> = ({ alt, className = '', width = 1920, height = 600 }) => {
  const [src, setSrc] = useState(() => {
    if (typeof window !== 'undefined' && window.devicePixelRatio >= 1.5) {
      return "/lovable-uploads/umrah-package-banner@2x.jpg";
    }
    return "/lovable-uploads/umrah-package-banner.jpg";
  });

  function handleError() {
    if (src === "/lovable-uploads/umrah-package-banner@2x.jpg") {
      setSrc("/lovable-uploads/umrah-package-banner.jpg");
    } else if (src === "/lovable-uploads/umrah-package-banner.jpg") {
      setSrc("/placeholder.svg");
    }
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover absolute inset-0 ${className}`}
      width={width}
      height={height}
      loading="eager"
      onError={handleError}
    />
  );
};

export default ResponsiveBanner; 