import { useState, useEffect } from 'react';
import { Testimonial, TestimonialFormData, TestimonialFilters } from '../types/testimonial';

// Simuler une API pour les témoignages
const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les témoignages
  const fetchTestimonials = async (filters?: TestimonialFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await mockApiDelay(1000); // Simuler un délai réseau
      
      // En production, faire un appel API réel
      // const response = await fetch('/api/testimonials', { ... });
      // const data = await response.json();
      
      // Pour la démo, utiliser des données mockées
      const mockData = await import('../pages/Testimonials');
      // setTestimonials(mockData.mockTestimonials);
      
    } catch (err) {
      setError('Erreur lors du chargement des témoignages');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un témoignage
  const addTestimonial = async (data: TestimonialFormData & { avatar?: File }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await mockApiDelay(2000); // Simuler l'upload et le traitement
      
      // En production, envoyer à l'API
      // const formData = new FormData();
      // Object.entries(data).forEach(([key, value]) => {
      //   if (value !== undefined) formData.append(key, value);
      // });
      // const response = await fetch('/api/testimonials', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // Simuler la création d'un nouveau témoignage
      const newTestimonial: Testimonial = {
        id: Date.now().toString(),
        userId: 'current-user-id',
        userName: 'Utilisateur Actuel',
        userEmail: 'user@example.com',
        userAvatar: data.avatar ? URL.createObjectURL(data.avatar) : undefined,
        title: data.title,
        content: data.content,
        rating: data.rating,
        location: data.location,
        hotelName: data.hotelName,
        createdAt: new Date(),
        updatedAt: new Date(),
        isApproved: false, // En attente de modération
        isPublic: data.isPublic,
        likes: 0,
        category: data.category
      };
      
      setTestimonials(prev => [newTestimonial, ...prev]);
      return newTestimonial;
      
    } catch (err) {
      setError('Erreur lors de l\'ajout du témoignage');
      console.error('Erreur:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Liker un témoignage
  const likeTestimonial = async (testimonialId: string) => {
    try {
      // En production, envoyer à l'API
      // await fetch(`/api/testimonials/${testimonialId}/like`, { method: 'POST' });
      
      setTestimonials(prev =>
        prev.map(testimonial =>
          testimonial.id === testimonialId
            ? { ...testimonial, likes: testimonial.likes + 1 }
            : testimonial
        )
      );
    } catch (err) {
      console.error('Erreur lors du like:', err);
    }
  };

  // Supprimer un témoignage (pour les admins ou l'auteur)
  const deleteTestimonial = async (testimonialId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await mockApiDelay(1000);
      
      // En production, envoyer à l'API
      // await fetch(`/api/testimonials/${testimonialId}`, { method: 'DELETE' });
      
      setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
      
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error('Erreur:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Modérer un témoignage (pour les admins)
  const moderateTestimonial = async (testimonialId: string, isApproved: boolean) => {
    try {
      // En production, envoyer à l'API
      // await fetch(`/api/testimonials/${testimonialId}/moderate`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ isApproved })
      // });
      
      setTestimonials(prev =>
        prev.map(testimonial =>
          testimonial.id === testimonialId
            ? { ...testimonial, isApproved, updatedAt: new Date() }
            : testimonial
        )
      );
    } catch (err) {
      console.error('Erreur lors de la modération:', err);
    }
  };

  // Obtenir les statistiques
  const getStats = () => {
    const approvedTestimonials = testimonials.filter(t => t.isApproved);
    
    return {
      total: approvedTestimonials.length,
      averageRating: approvedTestimonials.length > 0
        ? approvedTestimonials.reduce((sum, t) => sum + t.rating, 0) / approvedTestimonials.length
        : 0,
      totalLikes: approvedTestimonials.reduce((sum, t) => sum + t.likes, 0),
      fiveStars: approvedTestimonials.filter(t => t.rating === 5).length,
      byCategory: approvedTestimonials.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  return {
    testimonials,
    isLoading,
    error,
    fetchTestimonials,
    addTestimonial,
    likeTestimonial,
    deleteTestimonial,
    moderateTestimonial,
    getStats
  };
};

// Hook pour obtenir les témoignages populaires
export const usePopularTestimonials = (limit: number = 6) => {
  const { testimonials, isLoading, error } = useTestimonials();
  
  const popularTestimonials = testimonials
    .filter(t => t.isApproved && t.isPublic)
    .sort((a, b) => {
      // Trier par note puis par nombre de likes
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.likes - a.likes;
    })
    .slice(0, limit);

  return {
    testimonials: popularTestimonials,
    isLoading,
    error
  };
};

// Hook pour obtenir les témoignages récents
export const useRecentTestimonials = (limit: number = 3) => {
  const { testimonials, isLoading, error } = useTestimonials();
  
  const recentTestimonials = testimonials
    .filter(t => t.isApproved && t.isPublic)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  return {
    testimonials: recentTestimonials,
    isLoading,
    error
  };
};