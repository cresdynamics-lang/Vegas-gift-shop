import { Star, ExternalLink } from 'lucide-react';
import type { GoogleReviewsSettings } from '../types/settings';

function GoogleGIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

interface GoogleReviewsProps {
  config: GoogleReviewsSettings;
}

const GoogleReviews = ({ config }: GoogleReviewsProps) => {
  if (!config?.enabled || !config.reviews?.length) return null;

  return (
    <section className="mb-10 pb-10 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <GoogleGIcon />
          <div>
            <h3 className="text-lg font-bold text-gray-900">Google Reviews</h3>
            <p className="text-sm text-gray-500">{config.placeName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < Math.round(config.aggregateRating) ? 'fill-current' : 'text-gray-200'
                }
              />
            ))}
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-none">
              {config.aggregateRating.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">{config.totalReviews} reviews on Google</p>
          </div>
        </div>
      </div>

      <ul className="space-y-4">
        {config.reviews.map((review) => (
          <li
            key={review.id}
            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-gray-200 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0"
                aria-hidden
              >
                {review.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{review.author}</span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 px-1.5 py-0.5 rounded">
                    <GoogleGIcon />
                    Google
                  </span>
                </div>
                <div className="flex text-amber-400 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < review.rating ? 'fill-current' : 'text-gray-200'}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.date).toLocaleDateString('en-KE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {config.mapsUrl && (
        <a
          href={config.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-red-600 hover:underline"
        >
          View all reviews on Google
          <ExternalLink size={14} />
        </a>
      )}
    </section>
  );
};

export default GoogleReviews;
