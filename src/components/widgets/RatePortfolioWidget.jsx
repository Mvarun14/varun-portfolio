import { useState } from 'react';
import { motion } from 'framer-motion';
import Widget from './Widget';

export default function RatePortfolioWidget({ style }) {
  const [rating, setRating] = useState(0);
  return (
    <Widget style={style} rotate={1} hoverScale={1.03}>
      <div className="relative bg-white rounded-lg shadow-[0_14px_40px_-22px_rgba(0,0,0,0.15)] px-4 py-3 w-[200px] overflow-visible">
        {/* "Vote ✦" CTA */}
        <motion.div
          variants={{
            rest: { scale: 0.6, opacity: 0, y: 6 },
            hover: { scale: 1, opacity: 1, y: 0, transition: { delay: 0.1 } },
          }}
          className="absolute -top-3 -right-3 bg-pink-500 text-white text-[9px] font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          Vote <span>✦</span>
        </motion.div>

        <div className="text-[9px] tracking-[0.18em] uppercase text-neutral-500 mb-1.5">Rate this portfolio</div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.preventDefault(); setRating(i); }}
              className="text-[18px] leading-none"
              aria-label={`${i} stars`}
            >
              <span className={i <= rating ? 'text-amber-400' : 'text-neutral-300'}>
                {i <= rating ? '★' : '☆'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Widget>
  );
}
