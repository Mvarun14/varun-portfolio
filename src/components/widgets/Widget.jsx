import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Floating widget wrapper.
 * Entrance + continuous float trigger only when `show` is true
 * (driven by WorkSection's scroll-into-view detection).
 */
export default function Widget({
  children,
  href,
  to,
  style = {},
  rotate = 0,
  className = '',
  hoverScale = 1.04,
  external = false,
  show = true,
}) {
  const float = useMemo(() => ({
    duration: 4 + Math.random() * 2.5,
    amplitude: 4 + Math.random() * 4,
    phase: Math.random() * 1.2,
    entranceDelay: Math.random() * 0.6,
  }), []);

  const variants = {
    rest: { rotate, scale: 1 },
    hover: {
      rotate: 0,
      scale: hoverScale,
      transition: { type: 'spring', stiffness: 260, damping: 22 },
    },
    tap: { scale: 0.98 },
  };

  const target = show
    ? { opacity: 1, scale: 1, y: [0, -float.amplitude, 0] }
    : { opacity: 0, scale: 0.85, y: 24 };

  const content = (
    <motion.div
      className={`absolute will-change-transform ${className}`}
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
        whileTap="tap"
        variants={variants}
        className="cursor-pointer"
      >
        {children}
      </motion.div>
    </motion.div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className="contents"
      >
        {content}
      </a>
    );
  }
  if (to) {
    return (
      <a href={to} className="contents">
        {content}
      </a>
    );
  }
  return content;
}
