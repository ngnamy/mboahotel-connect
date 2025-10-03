import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TestimonialList from '../components/TestimonialList';
import TestimonialForm from '../components/TestimonialForm';
import { Testimonial, TestimonialFormData, TestimonialCategory } from '../types/testimonial';

// Données d'exemple avec des avatars
const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Marie Ngono',
    userEmail: 'marie.ngono@email.com',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    title: 'Une expérience exceptionnelle à Yaoundé',
    content: 'J\'ai utilisé MboaHotel Connect pour réserver un hôtel à Yaoundé lors de mon voyage d\'affaires. L\'application est très intuitive et j\'ai trouvé exactement ce que je cherchais. Le processus de réservation était simple et rapide. L\'hôtel correspondait parfaitement à la description et les photos. Je recommande vivement cette application à tous ceux qui voyagent au Cameroun.',
    rating: 5,
    location: 'Yaoundé',
    hotelName: 'Hôtel La Falaise',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isApproved: true,
    isPublic: true,
    likes: 24,
    category: TestimonialCategory.HOTEL_EXPERIENCE
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jean-Paul Mbarga',
    userEmail: 'jp.mbarga@email.com',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    title: 'Interface moderne et efficace',
    content: 'En tant que développeur, j\'apprécie particulièrement l\'interface utilisateur de MboaHotel Connect. Elle est moderne, responsive et très bien pensée. La fonction de géolocalisation est un vrai plus pour trouver les hôtels les plus proches. Les filtres de recherche sont complets et permettent de trouver exactement ce qu\'on cherche. Bravo à l\'équipe de développement !',
    rating: 5,
    location: 'Douala',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    isApproved: true,
    isPublic: true,
    likes: 18,
    category: TestimonialCategory.APP_USAGE
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Fatima Oumarou',
    userEmail: 'fatima.oumarou@email.com',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    title: 'Service client réactif et professionnel',
    content: 'J\'ai eu un petit problème avec ma réservation et j\'ai contacté le service client. Ils ont été très réactifs et ont résolu mon problème en moins de 2 heures. L\'équipe est professionnelle et à l\'écoute. C\'est rare de nos jours d\'avoir un service client aussi efficace. Je suis très satisfaite de mon expérience globale avec MboaHotel Connect.',
    rating: 4,
    location: 'Bafoussam',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    isApproved: true,
    isPublic: true,
    likes: 15,
    category: TestimonialCategory.CUSTOMER_SERVICE
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Pierre Kamga',
    userEmail: 'pierre.kamga@email.com',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    title: 'Réservation simple et sécurisée',
    content: 'Le processus de réservation sur MboaHotel Connect est vraiment bien fait. Tout est clair, les étapes sont logiques et on se sent en sécurité lors du paiement. J\'ai pu réserver mon hôtel en quelques minutes seulement. Les confirmations par email et SMS sont un plus appréciable. Une application qui facilite vraiment la vie des voyageurs.',
    rating: 5,
    location: 'Bamenda',
    hotelName: 'Ayaba Hotel',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    isApproved: true,
    isPublic: true,
    likes: 22,
    category: TestimonialCategory.BOOKING_PROCESS
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Aminata Diallo',
    userEmail: 'aminata.diallo@email.com',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    title: 'Parfait pour les voyages d\'affaires',
    content: 'Je voyage beaucoup pour le travail et MboaHotel Connect est devenu mon application de référence pour réserver mes hôtels au Cameroun. La sélection d\'hôtels est excellente, les prix sont compétitifs et la géolocalisation m\'aide à trouver des hôtels près de mes rendez-vous. L\'historique des réservations est très pratique pour mes notes de frais.',
    rating: 4,
    location: 'Yaoundé',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    isApproved: true,
    isPublic: true,
    likes: 19,
    category: TestimonialCategory.GENERAL
  },
  {
    id: '6',
    userId: 'user6',
    userName: 'Emmanuel Nkomo',
    userEmail: 'emmanuel.nkomo@email.com',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    title: 'Une révolution pour le tourisme camerounais',
    content: 'En tant que guide touristique, je recommande souvent MboaHotel Connect à mes clients. L\'application met en valeur nos beaux hôtels camerounais et facilite les réservations pour les touristes. C\'est exactement ce dont notre secteur avait besoin. L\'interface en français est un atout majeur pour nos clients locaux et francophones.',
    rating: 5,
    location: 'Kribi',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isApproved: true,
    isPublic: true,
    likes: 31,
    category: TestimonialCategory.GENERAL
  }
];

const Testimonials: React.FC = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTestimonial = () => {
    if (!user) {
      // Rediriger vers la page de connexion ou afficher un modal
      alert('Veuillez vous connecter pour ajouter un témoignage');
      return;
    }
    setShowForm(true);
  };

  const handleSubmitTestimonial = async (data: TestimonialFormData & { avatar?: File }) => {
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      // Simuler l'upload de l'avatar
      let avatarUrl = undefined;
      if (data.avatar) {
        // En production, uploader l'image vers un service de stockage
        avatarUrl = URL.createObjectURL(data.avatar);
      }

      // Créer le nouveau témoignage
      const newTestimonial: Testimonial = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userAvatar: avatarUrl,
        title: data.title,
        content: data.content,
        rating: data.rating,
        location: data.location,
        hotelName: data.hotelName || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        isApproved: false, // En attente de modération
        isPublic: data.isPublic,
        likes: 0,
        category: data.category
      };

      // Ajouter à la liste (en production, envoyer à l'API)
      setTestimonials(prev => [newTestimonial, ...prev]);
      setShowForm(false);

      // Afficher un message de succès
      alert('Votre témoignage a été soumis avec succès ! Il sera visible après modération.');
      
    } catch (error) {
      console.error('Erreur lors de la soumission du témoignage:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeTestimonial = (testimonialId: string) => {
    setTestimonials(prev =>
      prev.map(testimonial =>
        testimonial.id === testimonialId
          ? { ...testimonial, likes: testimonial.likes + 1 }
          : testimonial
      )
    );
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {showForm ? (
          <div className="mb-8">
            <TestimonialForm
              onSubmit={handleSubmitTestimonial}
              onCancel={handleCancelForm}
              isLoading={isSubmitting}
            />
          </div>
        ) : (
          <TestimonialList
            testimonials={testimonials.filter(t => t.isApproved && t.isPublic)}
            onAddTestimonial={handleAddTestimonial}
            onLikeTestimonial={handleLikeTestimonial}
            isLoading={isLoading}
            showAddButton={true}
          />
        )}
      </div>
    </div>
  );
};

export default Testimonials;