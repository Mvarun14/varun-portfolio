import { motion } from 'framer-motion';

const items = [
  { to: '#', label: 'Home', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  )},
  { to: '/resume', label: 'Resume', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  )},
];

export default function BottomNav() {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-30 flex items-center gap-1 bg-white/90 backdrop-blur-md border border-neutral-200/70 rounded-full shadow-[0_18px_45px_-20px_rgba(0,0,0,0.2)] px-2 py-1.5">
      {items.map((item) => (
        <motion.div key={item.label} whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
          <a
            href={item.to}
            className="w-9 h-9 flex items-center justify-center text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
            aria-label={item.label}
          >
            {item.icon}
          </a>
        </motion.div>
      ))}
    </div>
  );
}
