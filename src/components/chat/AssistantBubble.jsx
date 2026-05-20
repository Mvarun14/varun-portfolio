import { motion } from 'framer-motion';
import ChatAvatar from './ChatAvatar';

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ArrowUpRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

function CaseStudyCard({ data, index }) {
  return (
    <motion.a
      href={data.href || '#'}
      target={data.href ? '_blank' : undefined}
      rel={data.href ? 'noreferrer' : undefined}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="group flex items-center justify-between bg-white border border-neutral-200/80 rounded-2xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-neutral-300 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 flex-shrink-0 flex items-center justify-center">
          {data.image ? (
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
              {data.tag || '·'}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-[14px] font-semibold text-neutral-900 truncate">{data.title}</div>
          <div className="text-[12px] text-neutral-500 truncate">{data.subtitle}</div>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-colors flex-shrink-0 ml-3">
        <ArrowRight />
      </div>
    </motion.a>
  );
}

function TimelineCard({ entry, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35, ease: 'easeOut' }}
      className="bg-white border border-neutral-200/80 rounded-2xl px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 text-[10px] tracking-[0.18em] uppercase text-neutral-500 font-medium mb-2">
        <span>{entry.dates}</span>
        <span className="text-neutral-400">{entry.location}</span>
      </div>
      <div className="text-[14px] font-semibold text-neutral-900 leading-snug">{entry.title}</div>
      <div className="text-[12px] text-neutral-500 mb-2.5">{entry.company}</div>
      <ul className="space-y-1.5 text-[13px] text-neutral-700 leading-snug">
        {entry.bullets.map((b, j) => (
          <li key={j} className="flex gap-2">
            <span className="text-neutral-400 mt-0.5 flex-shrink-0">→</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function AssistantBubble({ message, onChoice }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-start gap-3"
    >
      <span className="sm:hidden mt-1">
        <ChatAvatar size={36} dotSize={9} />
      </span>
      <span className="hidden sm:inline-block mt-1">
        <ChatAvatar />
      </span>
      <div className="flex-1 min-w-0">
        {message.text && (
          <div className="inline-block max-w-[85%] sm:max-w-[65%] bg-white/85 backdrop-blur-sm border border-neutral-200/70 rounded-2xl px-5 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-[15px] leading-snug text-neutral-900">
            {message.text}
          </div>
        )}
        {message.cases && (
          <div className="mt-3 space-y-2 max-w-[85%] sm:max-w-[65%]">
            {message.cases.map((c, i) => (
              <CaseStudyCard key={c.title} data={c} index={i} />
            ))}
          </div>
        )}
        {message.skills && (
          <div className="mt-3 flex flex-wrap gap-2 max-w-[85%] sm:max-w-[75%]">
            {message.skills.map((s, i) => (
              <motion.div
                key={s.name}
                title={s.name}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3, type: 'spring', stiffness: 240, damping: 22 }}
                whileHover={{ y: -2, scale: 1.08 }}
                className="w-12 h-12 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] cursor-default"
              >
                <img
                  src={s.icon}
                  alt={s.name}
                  className="w-7 h-7 object-contain"
                  loading="lazy"
                  draggable={false}
                />
              </motion.div>
            ))}
          </div>
        )}
        {message.cta && (
          <div className="mt-3">
            <motion.a
              href={message.cta.href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-neutral-900 text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors shadow-[0_4px_20px_-6px_rgba(0,0,0,0.3)]"
            >
              {message.cta.icon === 'download' ? <DownloadIcon /> : null}
              {message.cta.label}
              {message.cta.icon !== 'download' ? <ArrowUpRight /> : null}
            </motion.a>
          </div>
        )}
        {message.choices && (
          <div className="mt-3 flex gap-2">
            {message.choices.map((c) => (
              <motion.button
                key={c.value}
                onClick={() => !message.resolved && onChoice?.(c)}
                disabled={message.resolved}
                whileHover={!message.resolved ? { y: -1 } : undefined}
                whileTap={!message.resolved ? { scale: 0.97 } : undefined}
                className={`px-5 py-2 text-[13px] font-medium rounded-full transition-colors ${
                  c.value === 'yes'
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.3)]'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                } ${message.resolved ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {c.label}
              </motion.button>
            ))}
          </div>
        )}
        {message.timeline && (
          <div className="mt-3 space-y-3 max-w-[90%] sm:max-w-[75%]">
            {message.timeline.map((entry, i) => (
              <TimelineCard key={entry.dates + entry.title} entry={entry} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
