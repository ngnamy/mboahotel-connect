import React, { useState, useRef } from 'react';
import { Star, Upload, X, MapPin, Hotel, User, Camera } from 'lucide-react';
import { TestimonialFormData, TestimonialCategory } from '../types/testimonial';

interface TestimonialFormProps {
  onSubmit: (data: TestimonialFormData & { avatar?: File }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<TestimonialFormData>({
    title: '',
    content: '',
    rating: 5,
    location: '',
    hotelName: '',
    category: TestimonialCategory.GENERAL,
    isPublic: true
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        setErrors(prev => ({ ...prev, avatar: 'L\'image ne doit pas dépasser 5MB' }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Veuillez sélectionner une image valide' }));
        return;
      }

      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, avatar: '' }));
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Le titre doit contenir au moins 10 caractères';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu est requis';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Le témoignage doit contenir au moins 50 caractères';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La localisation est requise';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'La note doit être entre 1 et 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({ ...formData, avatar: avatar || undefined });
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => handleRatingChange(index + 1)}
        className={`w-8 h-8 ${
          index < formData.rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 hover:text-yellow-300'
        } transition-colors`}
      >
        <Star className="w-full h-full" />
      </button>
    ));
  };

  const getCategoryLabel = (category: TestimonialCategory) => {
    const labels = {
      [TestimonialCategory.GENERAL]: 'Témoignage général',
      [TestimonialCategory.HOTEL_EXPERIENCE]: 'Expérience dans un hôtel',
      [TestimonialCategory.APP_USAGE]: 'Utilisation de l\'application',
      [TestimonialCategory.CUSTOMER_SERVICE]: 'Service client',
      [TestimonialCategory.BOOKING_PROCESS]: 'Processus de réservation'
    };
    return labels[category];
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ✍️ Partagez votre expérience
        </h2>
        <p className="text-gray-600">
          Votre témoignage aidera d'autres utilisateurs à découvrir MboaHotel Connect
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo de profil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo de profil (optionnelle)
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {avatarPreview ? (
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="Aperçu"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Choisir une photo</span>
              </button>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG max 5MB
              </p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          
          {errors.avatar && (
            <p className="text-red-600 text-sm mt-1">{errors.avatar}</p>
          )}
        </div>

        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Titre de votre témoignage *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Ex: Une expérience exceptionnelle avec MboaHotel"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Votre note *
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars()}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {formData.rating}/5 étoiles
            </span>
          </div>
        </div>

        {/* Catégorie */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.values(TestimonialCategory).map(category => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </select>
        </div>

        {/* Localisation */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Votre ville *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Ex: Yaoundé, Douala, Bafoussam..."
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.location && (
            <p className="text-red-600 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        {/* Hôtel (optionnel) */}
        <div>
          <label htmlFor="hotelName" className="block text-sm font-medium text-gray-700 mb-2">
            Hôtel concerné (optionnel)
          </label>
          <div className="relative">
            <Hotel className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="hotelName"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleInputChange}
              placeholder="Nom de l'hôtel si votre témoignage le concerne"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contenu */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Votre témoignage *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={6}
            placeholder="Partagez votre expérience en détail... Qu'est-ce qui vous a plu ? Qu'est-ce qui pourrait être amélioré ?"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.content ? (
              <p className="text-red-600 text-sm">{errors.content}</p>
            ) : (
              <p className="text-gray-500 text-sm">
                Minimum 50 caractères
              </p>
            )}
            <p className="text-gray-500 text-sm">
              {formData.content.length} caractères
            </p>
          </div>
        </div>

        {/* Visibilité */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              Rendre ce témoignage public (visible par tous les utilisateurs)
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Si décoché, votre témoignage ne sera visible que par les administrateurs
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Publication...' : 'Publier le témoignage'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;