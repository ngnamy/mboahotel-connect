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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative bg-white p-4 rounded-lg max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Conteneur de l'image principale */}
        <div className="relative h-[75vh]">
          <img src={images[currentIndex]} alt={`Image de la chambre ${currentIndex + 1}`} className="w-full h-full object-contain" />
        </div>

        {/* Boutons de navigation */}
        <button onClick={goToPrevious} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75">
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Miniatures */}
        <div className="flex justify-center space-x-2 mt-4 overflow-x-auto p-2">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Miniature ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={`w-20 h-16 object-cover rounded-md cursor-pointer border-2 ${currentIndex === index ? 'border-blue-500' : 'border-transparent'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryModal;

