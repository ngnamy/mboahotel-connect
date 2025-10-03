import React, { useState, useEffect } from 'react';
import { Check, X, Eye, EyeOff, Trash2, Filter, Search, Calendar, Star, Heart } from 'lucide-react';
import { Testimonial, TestimonialCategory } from '../types/testimonial';

// Données d'exemple incluant des témoignages en attente
const mockAdminTestimonials: Testimonial[] = [
  // Témoignages approuvés (déjà dans la liste publique)
  // ... (reprendre les données de Testimonials.tsx)
  
  // Témoignages en attente de modération
  {
    id: 'pending1',
    userId: 'user7',
    userName: 'Sophie Mballa',
    userEmail: 'sophie.mballa@email.com',
    userAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    title: 'Application très pratique pour mes voyages',
    content: 'Je voyage souvent entre Yaoundé et Douala pour le travail. MboaHotel Connect m\'a vraiment simplifié la vie pour trouver et réserver des hôtels. L\'interface est claire, les prix sont transparents et j\'ai toujours trouvé des hôtels de qualité. Je recommande particulièrement pour les voyageurs d\'affaires comme moi.',
    rating: 4,
    location: 'Yaoundé',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    isApproved: false,
    isPublic: true,
    likes: 0,
    category: TestimonialCategory.GENERAL
  },
  {
    id: 'pending2',
    userId: 'user8',
    userName: 'David Tchinda',
    userEmail: 'david.tchinda@email.com',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    title: 'Quelques améliorations à apporter',
    content: 'L\'application est globalement bien mais j\'ai rencontré quelques bugs lors de ma dernière réservation. Le processus s\'est interrompu à l\'étape de paiement et j\'ai dû recommencer. Heureusement le service client a été réactif. Avec quelques corrections, ce sera parfait.',
    rating: 3,
    location: 'Douala',
    hotelName: 'Hôtel Ibis Douala',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    isApproved: false,
    isPublic: true,
    likes: 0,
    category: TestimonialCategory.APP_USAGE
  }
];

const TestimonialAdmin: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockAdminTestimonials);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>(mockAdminTestimonials);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TestimonialCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let filtered = [...testimonials];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        testimonial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'pending':
          filtered = filtered.filter(t => !t.isApproved);
          break;
        case 'approved':
          filtered = filtered.filter(t => t.isApproved);
          break;
        case 'rejected':
          // En production, il faudrait un champ isRejected
          filtered = filtered.filter(t => !t.isApproved && !t.isPublic);
          break;
      }
    }

    // Filtrage par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Trier par date (plus récents en premier)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredTestimonials(filtered);
  }, [testimonials, searchTerm, statusFilter, categoryFilter]);

  const handleApprove = async (testimonialId: string) => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestimonials(prev =>
        prev.map(testimonial =>
          testimonial.id === testimonialId
            ? { ...testimonial, isApproved: true, updatedAt: new Date() }
            : testimonial
        )
      );
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (testimonialId: string) => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestimonials(prev =>
        prev.map(testimonial =>
          testimonial.id === testimonialId
            ? { ...testimonial, isApproved: false, isPublic: false, updatedAt: new Date() }
            : testimonial
        )
      );
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      return;
    }

    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = async (testimonialId: string) => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTestimonials(prev =>
        prev.map(testimonial =>
          testimonial.id === testimonialId
            ? { ...testimonial, isPublic: !testimonial.isPublic, updatedAt: new Date() }
            : testimonial
        )
      );
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (testimonial: Testimonial) => {
    if (testimonial.isApproved) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Approuvé
        </span>
      );
    } else if (!testimonial.isPublic) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" />
          Rejeté
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Calendar className="w-3 h-3 mr-1" />
          En attente
        </span>
      );
    }
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => !t.isApproved && t.isPublic).length,
    approved: testimonials.filter(t => t.isApproved).length,
    rejected: testimonials.filter(t => !t.isApproved && !t.isPublic).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛡️ Administration des Témoignages
          </h1>
          <p className="text-gray-600">
            Gérez et modérez les témoignages des utilisateurs
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                <div className="text-sm text-gray-600">En attente</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
                <div className="text-sm text-gray-600">Approuvés</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.rejected}</div>
                <div className="text-sm text-gray-600">Rejetés</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtre par statut */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvés</option>
              <option value="rejected">Rejetés</option>
            </select>

            {/* Filtre par catégorie */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les catégories</option>
              {Object.values(TestimonialCategory).map(category => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>

            {/* Bouton de réinitialisation */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Liste des témoignages */}
        <div className="space-y-6">
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun témoignage trouvé
              </h3>
              <p className="text-gray-600">
                Aucun témoignage ne correspond à vos critères de recherche
              </p>
            </div>
          ) : (
            filteredTestimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {testimonial.userAvatar ? (
                      <img
                        src={testimonial.userAvatar}
                        alt={testimonial.userName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {testimonial.userName.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.userName}</h3>
                      <p className="text-sm text-gray-600">{testimonial.userEmail}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(testimonial)}
                    <span className="text-xs text-gray-500">
                      {new Date(testimonial.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(testimonial.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {testimonial.rating}/5
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {getCategoryLabel(testimonial.category)}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {testimonial.title}
                  </h4>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {testimonial.content}
                  </p>

                  {testimonial.hotelName && (
                    <div className="mt-2 text-sm text-blue-600">
                      Hôtel: {testimonial.hotelName}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Heart className="w-4 h-4" />
                    <span>{testimonial.likes} j'aime</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!testimonial.isApproved && testimonial.isPublic && (
                      <>
                        <button
                          onClick={() => handleApprove(testimonial.id)}
                          disabled={isLoading}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approuver</span>
                        </button>
                        
                        <button
                          onClick={() => handleReject(testimonial.id)}
                          disabled={isLoading}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          <span>Rejeter</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => toggleVisibility(testimonial.id)}
                      disabled={isLoading}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                    >
                      {testimonial.isPublic ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Masquer</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Afficher</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      disabled={isLoading}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialAdmin;