import { motion } from 'framer-motion';
import Widget from './Widget';

const INTERESTS = ['Cricket', 'Reading', 'Chess', 'Music', 'Hackathons', 'AI Security'];

export default function InterestsWidget({ style }) {
  return (
    <Widget style={style} rotate={-2}>
      <div className="relative bg-white rounded-xl shadow-[0_18px_50px_-22px_rgba(0,0,0,0.15)] px-3.5 py-3 w-[210px] overflow-visible cursor-default">
        {/* "Same? ✦" CTA */}
        <motion.div
          variants={{
            rest: { scale: 0.6, opacity: 0, y: 6 },
            hover: { scale: 1, opacity: 1, y: 0, transition: { delay: 0.1 } },
          }}
          className="absolute -top-3 -right-3 bg-pink-500 text-white text-[9px] font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          Same? <span>✦</span>
        </motion.div>

        <div className="text-[9px] tracking-[0.18em] uppercase text-neutral-500 mb-2">Interests</div>
        <div className="flex flex-wrap gap-1">
          {INTERESTS.map((tag, i) => (
            <motion.span
              key={tag}
              variants={{
                rest: { y: 0 },
                hover: {
                  y: [-1, 0, -1],
                  transition: { delay: i * 0.05, repeat: 0, duration: 0.45 },
                },
              }}
              className="text-[10px] text-neutral-700 px-2 py-0.5 border border-neutral-200 rounded-full bg-neutral-50"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </Widget>
  );
}
