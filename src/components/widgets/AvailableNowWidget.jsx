import { motion } from 'framer-motion';
import Widget from './Widget';

export default function AvailableNowWidget({ style }) {
  return (
    <Widget style={style} rotate={4}>
      <div className="relative bg-emerald-400 rounded-xl shadow-[0_20px_55px_-22px_rgba(0,0,0,0.3)] px-4 py-3 w-[195px] text-neutral-900 overflow-visible cursor-default">
        {/* "Hire me" CTA */}
        <motion.div
          variants={{
            rest: { scale: 0.6, opacity: 0, y: 6 },
            hover: { scale: 1, opacity: 1, y: 0, transition: { delay: 0.1 } },
          }}
          className="absolute -top-3 -right-3 bg-neutral-900 text-white text-[9px] font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          Hire me <span>✦</span>
        </motion.div>

        <div className="flex items-center gap-1.5 text-[9px] tracking-[0.18em] uppercase font-medium mb-2">
          <span className="relative inline-flex">
            {/* Outer ping ring — continuous blink */}
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-neutral-900"
              animate={{ scale: [1, 2.4, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              style={{ width: 6, height: 6 }}
            />
            {/* Inner steady dot */}
            <motion.span
              className="relative inline-block rounded-full bg-neutral-900"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 6, height: 6 }}
            />
          </span>
          Available now
        </div>
        <div className="text-[15px] font-semibold leading-tight mb-2">Security Engineer</div>
        <ul className="space-y-0.5 text-[11px]">
          <li>→ India</li>
          <li>→ United States</li>
          <li>→ Open to Relocate</li>
        </ul>
      </div>
    </Widget>
  );
}
