
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface TrekGalleryProps {
  images: { src: string; alt: string }[];
}

export const TrekGallery = ({ images }: TrekGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-bold text-heritage-brown mb-2">Trek Gallery</h3>
      
      {/* Main image */}
      <div className="relative overflow-hidden rounded-lg">
        <AspectRatio ratio={4/3}>
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-all duration-500 ease-in-out",
                activeIndex === index 
                  ? "opacity-100 transform scale-100" 
                  : "opacity-0 transform scale-105"
              )}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </AspectRatio>
      </div>
      
      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative overflow-hidden rounded-md transition-all duration-300",
              activeIndex === index ? "ring-2 ring-heritage-purple" : "ring-1 ring-gray-200 hover:ring-heritage-purple/50"
            )}
          >
            <AspectRatio ratio={1} className="w-full">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </button>
        ))}
      </div>
    </div>
  );
};
