import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Widget from './Widget';

const BARS = [
  { base: 6, peak: 14 },
  { base: 10, peak: 4 },
  { base: 5, peak: 12 },
  { base: 12, peak: 6 },
  { base: 7, peak: 13 },
];

function Equalizer() {
  return (
    <div className="flex items-end gap-[2px] h-3.5" aria-hidden>
      {BARS.map((b, i) => (
        <motion.span
          key={i}
          className="w-[2px] bg-neutral-400 rounded-sm"
          initial={{ height: b.base }}
          animate={{ height: [b.base, b.peak, b.base] }}
          transition={{
            duration: 0.7 + i * 0.12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}

// Swap these whenever you want to feature a different song.
const VIDEO_ID = 'ApXoWvfEYVU';
const FEATURED = {
  title: 'Now Playing',
  artist: 'YouTube Music',
  duration: '—',
  url: `https://music.youtube.com/watch?v=${VIDEO_ID}`,
  cover: `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`,
};

function useYoutubeMeta(videoId) {
  const [meta, setMeta] = useState({ title: null, author: null });
  useEffect(() => {
    let cancelled = false;
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j || cancelled) return;
        setMeta({ title: j.title, author: j.author_name });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [videoId]);
  return meta;
}

export default function MusicWidget({ style, song = FEATURED }) {
  const meta = useYoutubeMeta(VIDEO_ID);
  const title = meta.title || song.title;
  const artist = (meta.author || song.artist || '').replace(/\s*-\s*Topic$/, '');
  return (
    <Widget style={style} rotate={-2} href={song.url} external>
      <div className="relative bg-neutral-900 text-white rounded-2xl shadow-[0_20px_55px_-20px_rgba(0,0,0,0.55)] p-3 w-[230px] overflow-visible">
        {/* "Listen ↗" CTA */}
        <motion.div
          variants={{
            rest: { scale: 0.6, opacity: 0, y: 6 },
            hover: { scale: 1, opacity: 1, y: 0, transition: { delay: 0.1 } },
          }}
          className="absolute -top-3 -right-3 bg-[#ff0000] text-white text-[9px] font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          YT Music <span>↗</span>
        </motion.div>

        <div className="flex items-center gap-2.5">
          <motion.div
            variants={{
              rest: { rotate: 0 },
              hover: { rotate: 8, transition: { type: 'spring', stiffness: 220 } },
            }}
            className="w-9 h-9 rounded-md overflow-hidden flex-shrink-0 bg-neutral-800"
          >
            {song.cover ? (
              <img src={song.cover} alt="" className="w-full h-full object-cover" />
            ) : null}
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium truncate">{title}</div>
            <div className="text-[10px] text-neutral-400 truncate">{artist}</div>
          </div>
          <Equalizer />
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-[9px] text-neutral-500 mb-1">
            <span>1:24</span><span>{song.duration}</span>
          </div>
          <div className="w-full h-[2px] bg-neutral-700 rounded-full overflow-hidden">
            <div className="h-full bg-white" style={{ width: '14%' }} />
          </div>
        </div>

        <div className="flex justify-center items-center gap-5 mt-2.5 text-neutral-200">
          <svg width="13" height="11" viewBox="0 0 16 14" fill="currentColor"><path d="M14 2L7 7L14 12V2ZM5 2L0 7L5 12V2Z"/></svg>
          <motion.div
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.12, transition: { type: 'spring', stiffness: 260 } },
            }}
            className="w-7 h-7 rounded-full bg-white text-neutral-900 flex items-center justify-center"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1L11 6L2 11V1Z"/></svg>
          </motion.div>
          <svg width="13" height="11" viewBox="0 0 16 14" fill="currentColor"><path d="M2 2L9 7L2 12V2ZM11 2L16 7L11 12V2Z"/></svg>
        </div>
      </div>
    </Widget>
  );
}
