
import React, { useState, useEffect } from 'react';
import { GalleryImage } from './gallery/GalleryImage';

const Gallery = ({ limit }: { limit?: number }) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const extensions = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];
      const imagePaths: string[] = [];

      for (let i = 1; i <= 110; i++) {
        for (const ext of extensions) {
          const path = `/images/gallery/${i}.${ext}`;
          try {
            const response = await fetch(path, { method: 'HEAD' });
            if (response.ok) {
              imagePaths.push(path);
              break; // Stop checking other extensions for this index
            }
          } catch (error) {
            console.error(`Error checking image: ${path}`, error);
          }
        }
      }

      setImages(limit ? imagePaths.slice(0, limit) : imagePaths);
    };

    fetchImages();
  }, [limit]);

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="section-title text-center animate-fade-in">Gallery</h2>
        <p className="section-subtitle text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>Explore the beauty of Nepal through our curated gallery</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                className="transition-all duration-500 hover:shadow-xl rounded-lg animate-fade-in"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <GalleryImage 
                  src={image} 
                  alt={`Gallery Image ${index + 1}`} 
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No images available in the gallery.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
