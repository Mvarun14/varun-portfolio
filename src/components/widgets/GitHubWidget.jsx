import { motion } from 'framer-motion';
import Widget from './Widget';
import { GITHUB_URL, GITHUB_HANDLE } from '../../links';

export default function GitHubWidget({ style }) {
  return (
    <Widget style={style} rotate={-4} href={GITHUB_URL} external>
      <div className="relative bg-neutral-900 text-white rounded-xl shadow-[0_20px_55px_-22px_rgba(0,0,0,0.5)] px-4 py-3 w-[185px] overflow-visible">
        {/* "Follow ✦" CTA */}
        <motion.div
          variants={{
            rest: { scale: 0.6, opacity: 0, y: 6 },
            hover: { scale: 1, opacity: 1, y: 0, transition: { delay: 0.1 } },
          }}
          className="absolute -top-3 -right-3 bg-pink-500 text-white text-[9px] font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          Follow <span>✦</span>
        </motion.div>

        <div className="text-[9px] tracking-[0.18em] uppercase text-neutral-400 mb-2">Code lives here</div>
        <div className="flex items-center gap-2">
          <motion.div
            variants={{
              rest: { rotate: 0, scale: 1 },
              hover: { rotate: -8, scale: 1.06, transition: { type: 'spring', stiffness: 220 } },
            }}
            className="w-7 h-7 rounded-md bg-white text-neutral-900 flex items-center justify-center flex-shrink-0"
          >
            {/* GitHub octocat (simplified) */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </motion.div>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold leading-tight">GitHub</div>
            <div className="text-[10px] text-neutral-400 truncate">{GITHUB_HANDLE}</div>
          </div>
        </div>
      </div>
    </Widget>
  );
}
