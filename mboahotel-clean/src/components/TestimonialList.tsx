import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, SortDesc, Plus } from 'lucide-react';
import TestimonialCard from './TestimonialCard';
import { Testimonial, TestimonialFilters, TestimonialCategory } from '../types/testimonial';

interface TestimonialListProps {
  testimonials: Testimonial[];
  onAddTestimonial?: () => void;
  onLikeTestimonial?: (testimonialId: string) => void;
  isLoading?: boolean;
  showAddButton?: boolean;
}

const TestimonialList: React.FC<TestimonialListProps> = ({
  testimonials,
  onAddTestimonial,
  onLikeTestimonial,
  isLoading = false,
  showAddButton = true
}) => {
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>(testimonials);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TestimonialFilters>({
    sortBy: 'recent'
  });

  useEffect(() => {
    let filtered = [...testimonials];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        testimonial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (testimonial.hotelName && testimonial.hotelName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrage par catégorie
    if (filters.category) {
      filtered = filtered.filter(testimonial => testimonial.category === filters.category);
    }

    // Filtrage par note
    if (filters.rating) {
      filtered = filtered.filter(testimonial => testimonial.rating >= filters.rating!);
    }

    // Filtrage par localisation
    if (filters.location) {
      filtered = filtered.filter(testimonial =>
        testimonial.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Tri
    switch (filters.sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'likes':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
    }

    setFilteredTestimonials(filtered);
  }, [testimonials, searchTerm, filters]);

  const handleFilterChange = (key: keyof TestimonialFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ sortBy: 'recent' });
    setSearchTerm('');
  };

  const getCategoryLabel = (category: TestimonialCategory) => {
    const labels = {
      [TestimonialCategory.GENERAL]: 'Général',
      [TestimonialCategory.HOTEL_EXPERIENCE]: 'Expérience Hôtel',
      [TestimonialCategory.APP_USAGE]: 'Utilisation App',
      [TestimonialCategory.CUSTOMER_SERVICE]: 'Service Client',
      [TestimonialCategory.BOOKING_PROCESS]: 'Réservation'
    };
    return labels[category];
  };

  const getSortLabel = (sortBy: string) => {
    const labels = {
      recent: 'Plus récents',
      rating: 'Mieux notés',
      likes: 'Plus aimés'
    };
    return labels[sortBy as keyof typeof labels];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-3 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            💬 Témoignages clients
          </h2>
          <p className="text-gray-600">
            Découvrez les expériences de nos utilisateurs avec MboaHotel Connect
          </p>
        </div>
        
        {showAddButton && onAddTestimonial && (
          <button
            onClick={onAddTestimonial}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un témoignage</span>
          </button>
        )}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans les témoignages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Boutons de contrôle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                showFilters
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>

            {(filters.category || filters.rating || filters.location || searchTerm) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trier par
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="recent">Plus récents</option>
                  <option value="rating">Mieux notés</option>
                  <option value="likes">Plus aimés</option>
                </select>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les catégories</option>
                  {Object.values(TestimonialCategory).map(category => (
                    <option key={category} value={category}>
                      {getCategoryLabel(category)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Note minimum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note minimum
                </label>
                <select
                  value={filters.rating || ''}
                  onChange={(e) => handleFilterChange('rating', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les notes</option>
                  <option value="5">5 étoiles</option>
                  <option value="4">4+ étoiles</option>
                  <option value="3">3+ étoiles</option>
                  <option value="2">2+ étoiles</option>
                  <option value="1">1+ étoiles</option>
                </select>
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                  placeholder="Ex: Yaoundé"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredTestimonials.length}</div>
              <div className="text-sm text-blue-700">Témoignages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredTestimonials.length > 0 
                  ? (filteredTestimonials.reduce((sum, t) => sum + t.rating, 0) / filteredTestimonials.length).toFixed(1)
                  : '0'
                }
              </div>
              <div className="text-sm text-blue-700">Note moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredTestimonials.reduce((sum, t) => sum + t.likes, 0)}
              </div>
              <div className="text-sm text-blue-700">J'aime total</div>
            </div>
          </div>
          
          <div className="text-sm text-blue-600">
            Trié par : {getSortLabel(filters.sortBy)}
          </div>
        </div>
      </div>

      {/* Liste des témoignages */}
      {filteredTestimonials.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun témoignage trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filters.category || filters.rating || filters.location
              ? 'Essayez de modifier vos critères de recherche'
              : 'Soyez le premier à partager votre expérience !'}
          </p>
          {showAddButton && onAddTestimonial && (
            <button
              onClick={onAddTestimonial}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter le premier témoignage</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTestimonials.map(testimonial => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onLike={onLikeTestimonial}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialList;