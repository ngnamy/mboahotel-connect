import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-7 h-7 cursor-pointer transition-colors ${
            (hoverRating || rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() === '' || rating === 0) {
      alert("Veuillez donner une note et écrire un commentaire.");
      return;
    }
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Laissez votre avis</h3>
      <p className="text-gray-600 mb-4">Partagez votre expérience pour aider les autres voyageurs.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Votre note *</label>
          <StarRatingInput rating={rating} setRating={setRating} />
        </div>
        <div>
          <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">Votre commentaire *</label>
          <textarea id="review-comment" rows={4} className="input resize-none" placeholder="Décrivez votre séjour, ce que vous avez aimé ou moins aimé..." value={comment} onChange={(e) => setComment(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary px-6 py-2">Soumettre l'avis</button>
      </form>
    </div>
  );
};

export default ReviewForm;

