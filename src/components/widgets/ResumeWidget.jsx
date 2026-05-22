import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RESUME_URL } from '../../links';
import { getFloatProfile } from './floatProfile';

export default function ResumeWidget({ style, show = true }) {
  const float = useMemo(
    () => getFloatProfile(`resume:${JSON.stringify(style)}`),
    [style]
  );

  const target = show
    ? { opacity: 1, scale: 1, y: [0, -float.amplitude, 0] }
    : { opacity: 0, scale: 0.85, y: 24 };

  return (
    <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="contents">
      <motion.div
        className="absolute will-change-transform"
        style={style}
        initial={{ opacity: 0, scale: 0.85, y: 24 }}
        animate={target}
        transition={{
          opacity: { duration: 0.55, delay: float.entranceDelay, ease: 'easeOut' },
          scale: { duration: 0.55, delay: float.entranceDelay, type: 'spring', stiffness: 200, damping: 22 },
          y: show
            ? {
                duration: float.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: float.entranceDelay + float.phase,
              }
            : { duration: 0.3 },
        }}
      >
        <motion.div
          initial="rest"
          animate="rest"
          whileHover="hover"
          whileTap={{ scale: 0.97 }}
          className="cursor-pointer flex flex-col items-center"
        >
          <motion.div
            variants={{
              rest: { y: 0, rotate: 6 },
              hover: { y: -4, rotate: 0, transition: { type: 'spring', stiffness: 240, damping: 18 } },
            }}
            className="relative w-[170px] h-[130px]"
          >
            {/* Back tab — slightly darker yellow piece behind the card */}
            <div
              className="absolute left-3 top-3 w-[55px] h-[18px] rounded-tl-[10px] rounded-tr-[10px]"
              style={{ background: 'linear-gradient(180deg, #e6c021 0%, #ecc826 100%)' }}
            />

            {/* Paper sheet #1 (resume document) slides up on hover */}
            <motion.div
              variants={{
                rest: { y: 12, opacity: 0, rotate: -3 },
                hover: {
                  y: -30,
                  opacity: 1,
                  rotate: -3,
                  transition: { delay: 0.05, type: 'spring', stiffness: 220, damping: 22 },
                },
              }}
              className="absolute left-4 top-5 w-[140px] h-[92px] bg-white rounded-md shadow-[0_10px_24px_-10px_rgba(0,0,0,0.35)] flex flex-col gap-1.5 px-3 pt-3"
            >
              <span className="block w-[60%] h-[4px] bg-neutral-800 rounded-full" />
              <span className="block w-[40%] h-[2px] bg-neutral-300 rounded-full" />
              <span className="block w-[80%] h-[2px] bg-neutral-200 rounded-full mt-1" />
              <span className="block w-[70%] h-[2px] bg-neutral-200 rounded-full" />
              <span className="block w-[55%] h-[2px] bg-neutral-200 rounded-full" />
            </motion.div>
            {/* Paper sheet #2 (slides up less) */}
            <motion.div
              variants={{
                rest: { y: 12, opacity: 0, rotate: 2 },
                hover: {
                  y: -22,
                  opacity: 1,
                  rotate: 2,
                  transition: { delay: 0.1, type: 'spring', stiffness: 220, damping: 22 },
                },
              }}
              className="absolute left-5 top-6 w-[135px] h-[88px] bg-white rounded-md shadow-[0_10px_24px_-10px_rgba(0,0,0,0.28)]"
            />

            {/* Card body (front) — yellow with rounded corners */}
            <div
              className="absolute left-0 top-[20px] w-[170px] h-[100px] rounded-[14px] shadow-[0_18px_38px_-16px_rgba(160,140,0,0.55)] flex flex-col justify-center px-4"
              style={{
                background: 'linear-gradient(180deg, #ffe066 0%, #ffd83a 100%)',
                zIndex: 20,
              }}
            >
              <div className="text-[9px] tracking-[0.18em] uppercase text-neutral-800 font-medium mb-1.5">CV</div>
              <div className="flex items-center gap-1.5 text-neutral-900">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div>
                  <div className="text-[13px] font-semibold leading-tight">Resume</div>
                  <div className="text-[10px] text-neutral-700">PDF · 1 page</div>
                </div>
              </div>
            </div>

            {/* Pink "Download ↓" CTA — bottom right on hover */}
            <motion.div
              variants={{
                rest: { scale: 0.6, opacity: 0, y: 8 },
                hover: {
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.18, type: 'spring', stiffness: 260, damping: 18 },
                },
              }}
              className="absolute -bottom-1 -right-2 z-30 bg-pink-500 text-white text-[12px] font-semibold px-3 py-1.5 rounded-full shadow-[0_10px_24px_-6px_rgba(236,72,153,0.6)] flex items-center gap-1"
            >
              Download <span>↓</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </a>
  );
}
