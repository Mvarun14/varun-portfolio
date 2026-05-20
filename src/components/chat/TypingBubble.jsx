import { motion } from 'framer-motion';
import ChatAvatar from './ChatAvatar';

export default function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-end gap-3"
    >
      <span className="sm:hidden">
        <ChatAvatar size={36} dotSize={9} />
      </span>
      <span className="hidden sm:inline-block">
        <ChatAvatar />
      </span>
      <div className="bg-white/85 backdrop-blur-sm border border-neutral-200/70 rounded-2xl px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-neutral-400"
              animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
