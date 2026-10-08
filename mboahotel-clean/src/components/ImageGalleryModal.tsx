import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryModalProps {
  images: string[];
  onClose: () => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Gérer la navigation au clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious(e as any);
      else if (e.key === 'ArrowRight') goToNext(e as any);
      else if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex]);

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6" onClick={onClose}>
      <div
        className="relative flex max-h-[calc(100vh-1.5rem)] w-full max-w-4xl flex-col gap-3 overflow-hidden rounded-lg bg-white p-3 sm:max-h-[calc(100vh-3rem)] sm:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          aria-label="Fermer la galerie"
          className="absolute right-2 top-2 z-10 rounded-full bg-white p-2 text-gray-800 shadow hover:bg-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Conteneur de l'image principale */}
        <div className="relative h-[55vh] max-h-[640px] min-h-0 shrink">
          <img src={images[currentIndex]} alt={`Image de la chambre ${currentIndex + 1}`} className="h-full w-full object-contain" />
        </div>

        {/* Boutons de navigation */}
        <button
          onClick={goToPrevious}
          aria-label="Image précédente"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={goToNext}
          aria-label="Image suivante"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Miniatures */}
        <div className="flex max-w-full shrink-0 justify-center gap-2 overflow-x-auto p-1">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Miniature ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={`h-14 w-20 shrink-0 cursor-pointer rounded-md border-2 object-cover ${currentIndex === index ? 'border-forest' : 'border-transparent'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryModal;
