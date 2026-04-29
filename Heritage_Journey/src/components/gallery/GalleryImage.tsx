import { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface GalleryImageProps {
  src: string;
  alt: string;
  aspectRatio?: number;
}

export const GalleryImage = ({ src, alt, aspectRatio = 4/3 }: GalleryImageProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-lg group">
      <AspectRatio ratio={aspectRatio}>
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoading(false)}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
            loading ? "opacity-0" : "opacity-100"
          )}
        />
        {loading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
      </AspectRatio>
    </div>
  );
};
