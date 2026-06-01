import { useEffect, useMemo, useState } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { API_URL } from '../config';
import { DEFAULT_SETTINGS, type GoogleReview, type GoogleReviewsSettings } from '../types/settings';
import { formatDisplayText } from '../utils/formatText';

function GoogleGIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

const AVATAR_GRADIENTS = [
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
  'from-indigo-500 to-blue-700',
  'from-red-500 to-amber-600',
];

function avatarGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[hash];
}

function TestimonialCard({ review }: { review: GoogleReview }) {
  return (
    <article
      className="flex-shrink-0 w-[min(100vw-2rem,340px)] sm:w-[360px] bg-white border border-gray-200/80 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      aria-label={`Review by ${review.author}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarGradient(review.id)} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}
        >
          {review.author.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-gray-900 text-sm truncate">{review.author}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-full">
              <GoogleGIcon className="w-3 h-3" />
              Google
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < review.rating ? 'fill-current' : 'text-gray-200'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(review.date).toLocaleDateString('en-KE', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
        &ldquo;{formatDisplayText(review.text)}&rdquo;
      </p>
    </article>
  );
}

const GoogleTestimonialsMarquee = () => {
  const [config, setConfig] = useState<GoogleReviewsSettings>(DEFAULT_SETTINGS.googleReviews);

  useEffect(() => {
    fetch(`${API_URL}/api/settings/public`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.googleReviews) {
          setConfig({ ...DEFAULT_SETTINGS.googleReviews, ...data.googleReviews });
        }
      })
      .catch(() => {});
  }, []);

  const reviews = useMemo(() => {
    const list = config.reviews?.length ? config.reviews : DEFAULT_SETTINGS.googleReviews.reviews;
    if (list.length >= 7) return list;
    const padded = [...list];
    while (padded.length < 7) {
      padded.push({ ...list[padded.length % list.length], id: `pad-${padded.length}` });
    }
    return padded;
  }, [config.reviews]);

  const track = useMemo(() => [...reviews, ...reviews], [reviews]);

  if (!config.enabled || reviews.length === 0) return null;

  const durationSec = Math.max(40, reviews.length * 9);

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GoogleGIcon className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Google Reviews
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              What our customers say
            </h2>
            <p className="text-gray-600 max-w-xl">
              Real feedback from shoppers who found their perfect gift at {config.placeName}.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm shrink-0">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < Math.round(config.aggregateRating) ? 'fill-current' : 'text-gray-200'
                  }
                />
              ))}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-none">
                {config.aggregateRating.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">{config.totalReviews}+ on Google</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="testimonial-marquee-mask overflow-hidden">
          <div
            className="testimonial-marquee-track flex gap-5 w-max pl-4"
            style={{ animationDuration: `${durationSec}s` }}
          >
            {track.map((review, i) => (
              <TestimonialCard key={`${review.id}-${i}`} review={review} />
            ))}
          </div>
        </div>
      </div>

      {config.mapsUrl && (
        <div className="max-w-7xl mx-auto px-4 mt-8 text-center">
          <a
            href={config.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:underline"
          >
            Read all reviews on Google
            <ExternalLink size={14} />
          </a>
        </div>
      )}
    </section>
  );
};

export default GoogleTestimonialsMarquee;
