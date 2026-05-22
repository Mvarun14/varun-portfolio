import { useEffect, useRef, useState } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], .project-card, [data-cursor-label]';

const TEXT_INPUT_SELECTOR =
  'input, textarea, select, [contenteditable="true"]';

function supportsFinePointer() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(hover: hover)').matches &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function MagneticCursor() {
  const cursorRef = useRef(null);
  const rafRef = useRef(null);
  const positionRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
  });
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const mediaQueries = [
      window.matchMedia('(hover: hover)'),
      window.matchMedia('(pointer: fine)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
    ];
    const syncEnabled = () => setEnabled(supportsFinePointer());

    syncEnabled();
    mediaQueries.forEach((mq) => mq.addEventListener('change', syncEnabled));

    return () => {
      mediaQueries.forEach((mq) => mq.removeEventListener('change', syncEnabled));
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const updateCursor = () => {
      const state = positionRef.current;
      state.currentX += (state.targetX - state.currentX) * 0.18;
      state.currentY += (state.targetY - state.currentY) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(updateCursor);
    };

    const updateHoverState = (target) => {
      const element = target instanceof Element ? target : null;
      const textInput = element?.closest(TEXT_INPUT_SELECTOR);
      const interactive = element?.closest(INTERACTIVE_SELECTOR);

      setVisible(!textInput);
      setHovering(Boolean(interactive) && !textInput);
      setLabel(textInput ? '' : interactive?.dataset.cursorLabel || '');
    };

    const handlePointerMove = (event) => {
      const state = positionRef.current;
      state.targetX = event.clientX;
      state.targetY = event.clientY;

      if (!visible) {
        state.currentX = event.clientX;
        state.currentY = event.clientY;
      }

      setVisible(true);
      updateHoverState(event.target);
    };

    const handlePointerLeave = () => setVisible(false);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    rafRef.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, visible]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`magnetic-cursor ${visible ? 'is-visible' : ''} ${
        hovering ? 'is-hovering' : ''
      } ${label ? 'has-label' : ''}`}
    >
      {label && <span>{label}</span>}
    </div>
  );
}
