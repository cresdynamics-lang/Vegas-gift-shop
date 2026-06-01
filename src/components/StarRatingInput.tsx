import { useState } from 'react';
import { Star } from 'lucide-react';

const LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

const StarRatingInput = ({ value, onChange, disabled = false }: StarRatingInputProps) => {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="space-y-2">
      <div
        className="flex items-center gap-0.5"
        role="radiogroup"
        aria-label="Your rating"
        onMouseLeave={() => setHover(0)}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          const filled = starValue <= active;
          return (
            <button
              key={starValue}
              type="button"
              disabled={disabled}
              onClick={() => onChange(starValue)}
              onMouseEnter={() => !disabled && setHover(starValue)}
              className="p-1 rounded-md hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50"
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star
                size={28}
                className={
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }
              />
            </button>
          );
        })}
      </div>
      <p className="text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{value} / 5 stars</span>
        {' · '}
        {LABELS[value]}
      </p>
    </div>
  );
};

export default StarRatingInput;
