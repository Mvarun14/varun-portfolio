import { motion } from 'framer-motion';

export default function UserBubble({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex justify-end"
    >
      <div
        className="max-w-[85%] sm:max-w-[70%] bg-[#0E0E0E] text-white text-[15px] leading-snug rounded-2xl px-5 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
      >
        {text}
      </div>
    </motion.div>
  );
}
