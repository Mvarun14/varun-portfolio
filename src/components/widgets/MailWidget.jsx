import { motion } from 'framer-motion';
import Widget from './Widget';

const EMAIL = 'phanivarunm@gmail.com';
const GMAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

export default function MailWidget({ style }) {
  return (
    <Widget style={style} rotate={-3} href={GMAIL_URL} external>
      <div className="relative bg-white rounded-xl shadow-[0_20px_55px_-22px_rgba(0,0,0,0.18)] px-4 py-3 w-[210px] overflow-visible">
        {/* "Send ✦" CTA */}
        <motion.div
          variants={{
            rest: { scale: 0.6, opacity: 0, y: 6 },
            hover: { scale: 1, opacity: 1, y: 0, transition: { delay: 0.1 } },
          }}
          className="absolute -top-3 -right-3 bg-pink-500 text-white text-[9px] font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          Send <span>✦</span>
        </motion.div>

        <div className="text-[9px] tracking-[0.18em] uppercase text-neutral-500 mb-2">Mail me</div>
        <div className="flex items-center gap-2.5">
          <motion.div
            variants={{
              rest: { rotate: 0, y: 0 },
              hover: { rotate: -6, y: -1, transition: { type: 'spring', stiffness: 240 } },
            }}
            className="w-8 h-8 rounded-md bg-white border border-neutral-200 flex items-center justify-center shadow-sm flex-shrink-0"
          >
            {/* Gmail "M" logo */}
            <svg width="16" height="12" viewBox="0 0 24 18" aria-hidden>
              <path d="M0 18V2.6L12 11.4 24 2.6V18H18.4V7.8L12 12.6 5.6 7.8V18H0Z" fill="#ea4335" />
              <path d="M0 2.6V0h5.6L12 4.8 18.4 0H24v2.6L12 11.4 0 2.6Z" fill="#ea4335" opacity=".95" />
            </svg>
          </motion.div>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold leading-tight text-neutral-900">Gmail</div>
            <div className="text-[10px] text-neutral-600 truncate">{EMAIL}</div>
          </div>
        </div>
      </div>
    </Widget>
  );
}
