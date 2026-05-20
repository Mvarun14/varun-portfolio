import { motion } from 'framer-motion';
import Widget from './Widget';
import { CALENDAR_URL } from '../../links';

export default function OpenToWorkWidget({ style }) {
  return (
    <Widget style={style} rotate={2} href={CALENDAR_URL} external>
      <div className="relative bg-neutral-900 text-white rounded-xl shadow-[0_20px_55px_-22px_rgba(0,0,0,0.45)] px-4 py-3 w-[185px] overflow-visible">
        {/* "Book ✦" CTA */}
        <motion.div
          variants={{
            rest: { scale: 0.6, opacity: 0, y: 6 },
            hover: { scale: 1, opacity: 1, y: 0, transition: { delay: 0.1 } },
          }}
          className="absolute -top-3 -right-3 bg-pink-500 text-white text-[9px] font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          Book <span>✦</span>
        </motion.div>

        <div className="text-[9px] tracking-[0.18em] uppercase text-neutral-400 mb-2">Open to work</div>
        <div className="flex items-center gap-2.5">
          <motion.div
            variants={{
              rest: { rotate: 0 },
              hover: { rotate: -8, transition: { type: 'spring', stiffness: 250 } },
            }}
            className="w-7 h-7 rounded-md bg-neutral-700 flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </motion.div>
          <div>
            <div className="text-[12px] font-medium leading-tight">Book a call</div>
            <div className="text-[10px] text-neutral-400">Schedule 30 min</div>
          </div>
        </div>
      </div>
    </Widget>
  );
}
