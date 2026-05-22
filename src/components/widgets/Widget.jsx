import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getFloatProfile } from './floatProfile';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 768px)').matches;
  });
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
}

/**
 * Floating widget wrapper.
 * Desktop (md+): absolute positioned via `style`, with continuous float.
 * Mobile: stacks in normal flow (no absolute, no float animation).
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
  const isDesktop = useIsDesktop();

  const float = useMemo(
    () => getFloatProfile(`${href || to || className || 'widget'}:${rotate}:${JSON.stringify(style)}`),
    [className, href, rotate, style, to]
  );

  const variants = {
    rest: { rotate: isDesktop ? rotate : 0, scale: 1 },
    hover: {
      rotate: 0,
      scale: hoverScale,
      transition: { type: 'spring', stiffness: 260, damping: 22 },
    },
    tap: { scale: 0.98 },
  };

  const target = show
    ? {
        opacity: 1,
        scale: 1,
        y: isDesktop ? [0, -float.amplitude, 0] : 0,
      }
    : { opacity: 0, scale: 0.85, y: 24 };

  const positionClass = isDesktop ? 'absolute' : 'relative';
  const appliedStyle = isDesktop ? style : undefined;

  const content = (
    <motion.div
      className={`${positionClass} will-change-transform ${className}`}
      style={appliedStyle}
      initial={{ opacity: 0, scale: 0.85, y: 24 }}
      animate={target}
      transition={{
        opacity: { duration: 0.55, delay: float.entranceDelay, ease: 'easeOut' },
        scale: { duration: 0.55, delay: float.entranceDelay, type: 'spring', stiffness: 200, damping: 22 },
        y: isDesktop && show
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
        rel={external ? 'noopener noreferrer' : undefined}
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
