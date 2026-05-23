import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Widget from './Widget';

function format(now, timeZone) {
  const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone };
  return new Intl.DateTimeFormat('en-GB', opts).format(now);
}

function flagEmoji(code) {
  if (typeof code !== 'string' || code.length !== 2 || !/^[A-Za-z]{2}$/.test(code)) return '';
  const base = 0x1F1E6 - 'A'.charCodeAt(0);
  const upper = code.toUpperCase();
  return String.fromCodePoint(upper.charCodeAt(0) + base, upper.charCodeAt(1) + base);
}

export default function ClockWidget({
  style,
  location = 'Hyderabad, IN',
  timeZone = 'Asia/Kolkata',
  abbr = 'IST',
  utc = 'UTC+5:30',
  rotate = 3,
  countryCode,
}) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const derivedCode = countryCode ?? location.match(/,\s*([A-Za-z]{2})\s*$/)?.[1] ?? '';
  const flag = flagEmoji(derivedCode);

  return (
    <Widget style={style} rotate={rotate}>
      <div className="relative bg-white rounded-xl shadow-[0_18px_50px_-22px_rgba(0,0,0,0.18)] px-4 py-3 w-[200px] overflow-visible cursor-default">
        <motion.div
          variants={{
            rest: { scale: 0, opacity: 0 },
            hover: { scale: 1, opacity: 1, transition: { delay: 0.08 } },
          }}
          className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"
        />
        <div className="flex items-center gap-1.5 mb-0.5">
          {flag && (
            <span className="text-[13px] leading-none" aria-hidden="true">{flag}</span>
          )}
          <span className="text-[9px] tracking-[0.18em] text-neutral-500 font-medium uppercase">
            {location}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[26px] font-medium text-neutral-900 tabular-nums tracking-tight">{format(now, timeZone)}</span>
          <span className="text-[9px] text-neutral-500 ml-0.5">{abbr}</span>
        </div>
        <div className="text-[9px] tracking-[0.18em] text-neutral-400 font-medium uppercase mt-0.5">
          {abbr} · {utc}
        </div>
      </div>
    </Widget>
  );
}
