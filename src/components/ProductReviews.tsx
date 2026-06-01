import { useEffect, useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { useCustomerStore } from '../store/useCustomerStore';
import { syncProductToBackend } from '../utils/syncProductToBackend';
import { products } from '../data/products';
import StarRatingInput from './StarRatingInput';

export type ProductReview = {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: string;
};

interface ProductReviewsProps {
  productId: string;
  productName: string;
  initialCount?: number;
  onStatsChange?: (stats: { rating: number; reviewCount: number }) => void;
}

const ProductReviews = ({
  productId,
  productName,
  initialCount = 0,
  onStatsChange,
}: ProductReviewsProps) => {
  const { user, token, isAuthenticated } = useCustomerStore();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewCount, setReviewCount] = useState(initialCount);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [apiUnavailable, setApiUnavailable] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewerEmail, setReviewerEmail] = useState(user?.email || '');

  const loadReviews = async () => {
    setLoading(true);
    setApiUnavailable(false);
    try {
      const catalogProduct = products.find((p) => p.id === productId);
      if (catalogProduct) {
        await syncProductToBackend(catalogProduct);
      }

      const reviewsRes = await fetch(`${API_URL}/api/products/${productId}/reviews`);

      if (reviewsRes.status === 404) {
        setReviews([]);
        return;
      }
      if (!reviewsRes.ok) throw new Error('Failed to load');
      const data = await reviewsRes.json();
      setReviews(data.reviews || []);
      setReviewCount(data.reviewCount ?? 0);
      onStatsChange?.({ rating: data.rating ?? 0, reviewCount: data.reviewCount ?? 0 });
    } catch {
      setApiUnavailable(true);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  useEffect(() => {
    if (user) {
      setReviewerName(user.name || '');
      setReviewerEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (rating < 1 || rating > 5) {
      setError('Please select a star rating from 1 to 5.');
      return;
    }

    setSubmitting(true);

    try {
      const catalogProduct = products.find((p) => p.id === productId);
      if (catalogProduct) {
        await syncProductToBackend(catalogProduct);
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          rating,
          comment,
          reviewerName: reviewerName.trim(),
          reviewerEmail: reviewerEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      setMessage(data.message || 'Thank you! Your review was submitted and will appear after approval.');
      setComment('');
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const siteReviewLabel =
    reviewCount > 0 ? `Reviews (${reviewCount})` : 'Reviews';

  return (
    <div className="max-w-3xl">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{siteReviewLabel}</h3>
      <p className="text-sm text-gray-500 mb-6">
        Share your experience with this product. Tap the stars below to rate, then write your review.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 py-8">
          <Loader2 className="animate-spin" size={18} />
          Loading reviews…
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-600 mb-8">No reviews yet. Be the first to rate this product.</p>
      ) : (
        <ul className="space-y-6 mb-10">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? 'fill-current' : 'text-gray-200'}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-2">{review.rating}/5</span>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">{review.reviewerName}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.createdAt).toLocaleDateString('en-KE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h4 className="text-sm font-bold text-gray-900 mb-1">Write a review</h4>
        <p className="text-xs text-gray-500 mb-4">
          Your review will appear after our team approves it.
        </p>

        {apiUnavailable && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded px-3 py-2 mb-4">
            Reviews require the backend running on port 5000.
          </p>
        )}

        {message && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-3 py-2 mb-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
              Your rating *
            </label>
            <StarRatingInput
              value={rating}
              onChange={setRating}
              disabled={submitting || apiUnavailable}
            />
          </div>

          {!isAuthenticated && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Name *
                </label>
                <input
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white"
                />
              </div>
            </div>
          )}

          {isAuthenticated && (
            <p className="text-xs text-gray-600">
              Reviewing as <strong>{user?.name || user?.email}</strong>.{' '}
              <Link to="/account" className="text-red-600 hover:underline">
                Account
              </Link>
            </p>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Your review *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white"
              placeholder={`Share your experience with "${productName}"…`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || apiUnavailable}
            className="bg-gray-900 hover:bg-black text-white text-sm font-bold uppercase tracking-wide px-6 py-3 disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductReviews;
