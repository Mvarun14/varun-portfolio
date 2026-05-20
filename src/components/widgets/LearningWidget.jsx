import { motion } from 'framer-motion';
import Widget from './Widget';

export default function LearningWidget({ style }) {
  return (
    <Widget style={style} rotate={-3}>
      <div className="relative bg-yellow-100 rounded-lg shadow-[0_14px_40px_-22px_rgba(0,0,0,0.2)] px-3 py-2 w-[175px] cursor-default overflow-visible">
        {/* "Curious? ✦" CTA */}
        <motion.div
          variants={{
            rest: { scale: 0.6, opacity: 0, y: 6 },
            hover: { scale: 1, opacity: 1, y: 0, transition: { delay: 0.1 } },
          }}
          className="absolute -top-3 -right-3 bg-pink-500 text-white text-[9px] font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          Curious? <span>✦</span>
        </motion.div>

        <div className="text-[10px] font-semibold text-neutral-900 mb-0.5">Currently learning</div>
        <div className="flex items-center gap-1 text-[11px] text-neutral-800">
          <motion.span
            variants={{
              rest: { rotate: 0 },
              hover: { rotate: [0, -15, 15, -10, 10, 0], transition: { duration: 0.6 } },
            }}
            className="inline-block"
          >
            🧠
          </motion.span>
          <span>Agentic AI</span>
        </div>
      </div>
    </Widget>
  );
}
