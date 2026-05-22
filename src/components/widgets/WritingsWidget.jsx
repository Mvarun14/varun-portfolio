import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getFloatProfile } from './floatProfile';

const MEDIUM_URL = 'https://medium.com/@phanivarun';

export default function WritingsWidget({ style, show = true }) {
  const float = useMemo(
    () => getFloatProfile(`writings:${JSON.stringify(style)}`),
    [style]
  );

  const target = show
    ? { opacity: 1, scale: 1, y: [0, -float.amplitude, 0] }
    : { opacity: 0, scale: 0.85, y: 24 };

  return (
    <a href={MEDIUM_URL} target="_blank" rel="noopener noreferrer" className="contents">
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
              rest: { y: 0 },
              hover: { y: -4, transition: { type: 'spring', stiffness: 240, damping: 18 } },
            }}
            className="relative w-[130px] h-[108px]"
          >
            {/* Folder back tab (the darker amber piece behind the folder body) */}
            <div
              className="absolute left-2.5 top-2.5 w-[48px] h-[16px] rounded-tl-[8px] rounded-tr-[8px]"
              style={{ background: 'linear-gradient(180deg, #cf8b1f 0%, #d68f1d 100%)' }}
            />

            {/* Paper sheet #1 (slides up on hover) */}
            <motion.div
              variants={{
                rest: { y: 8, opacity: 0, rotate: -3 },
                hover: {
                  y: -24,
                  opacity: 1,
                  rotate: -3,
                  transition: { delay: 0.05, type: 'spring', stiffness: 220, damping: 22 },
                },
              }}
              className="absolute left-3 top-4 w-[105px] h-[72px] bg-white rounded-md shadow-[0_10px_24px_-10px_rgba(0,0,0,0.35)]"
            />
            {/* Paper sheet #2 (slides up a little less) */}
            <motion.div
              variants={{
                rest: { y: 8, opacity: 0, rotate: 2 },
                hover: {
                  y: -18,
                  opacity: 1,
                  rotate: 2,
                  transition: { delay: 0.1, type: 'spring', stiffness: 220, damping: 22 },
                },
              }}
              className="absolute left-4 top-5 w-[100px] h-[70px] bg-white rounded-md shadow-[0_10px_24px_-10px_rgba(0,0,0,0.28)] flex items-start pt-2.5 pl-2.5"
            >
              <span className="block w-[55px] h-[2.5px] bg-neutral-300 rounded-full" />
            </motion.div>

            {/* Folder body (front) — gradient yellow with rounded corners */}
            <div
              className="absolute left-0 top-[16px] w-[130px] h-[82px] rounded-[12px] shadow-[0_18px_38px_-16px_rgba(180,120,0,0.55)]"
              style={{
                background: 'linear-gradient(180deg, #fbc24a 0%, #f6a92a 100%)',
                zIndex: 20,
              }}
            />

            {/* Pink "Click! ✦" CTA — bottom right on hover */}
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
              className="absolute -bottom-1 -right-1.5 z-30 bg-pink-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-[0_10px_24px_-6px_rgba(236,72,153,0.6)] flex items-center gap-1"
            >
              Click! <span>✦</span>
            </motion.div>
          </motion.div>

          <div className="text-[9px] tracking-[0.18em] uppercase text-neutral-500 font-medium mt-2">
            My Writings
          </div>
        </motion.div>
      </motion.div>
    </a>
  );
}
