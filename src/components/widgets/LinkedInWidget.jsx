import { motion } from 'framer-motion';
import Widget from './Widget';

export default function LinkedInWidget({ style }) {
  return (
    <Widget style={style} rotate={-5} href="https://www.linkedin.com/in/mpvarun/" external>
      <div className="relative bg-[#1e57e8] text-white rounded-xl shadow-[0_22px_55px_-22px_rgba(30,87,232,0.45)] px-4 py-3 w-[175px] overflow-visible">
        {/* "Connect" CTA */}
        <motion.div
          variants={{
            rest: { scale: 0.6, opacity: 0, y: 6 },
            hover: { scale: 1, opacity: 1, y: 0, transition: { delay: 0.1 } },
          }}
          className="absolute -top-3 -right-3 bg-white text-[#1e57e8] text-[9px] font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          Connect <span>↗</span>
        </motion.div>

        <div className="text-[9px] tracking-[0.18em] uppercase text-blue-100 mb-2">Find me online</div>
        <div className="flex items-center gap-1.5">
          <motion.div
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.1, transition: { type: 'spring', stiffness: 260 } },
            }}
            className="w-6 h-6 rounded bg-white text-[#1e57e8] flex items-center justify-center font-bold text-[11px]"
          >
            in
          </motion.div>
          <div>
            <div className="text-[12px] font-semibold leading-tight">LinkedIn</div>
            <div className="text-[10px] text-blue-100">/in/phanivarun</div>
          </div>
        </div>
      </div>
    </Widget>
  );
}
