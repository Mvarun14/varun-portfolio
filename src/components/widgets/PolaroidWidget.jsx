import { motion } from 'framer-motion';
import Widget from './Widget';
import photo from '../../varunportfolio.png';

export default function PolaroidWidget({ style }) {
  return (
    <Widget style={style} rotate={-4}>
      <div className="relative bg-white rounded-[6px] shadow-[0_18px_50px_-20px_rgba(0,0,0,0.35)] p-2.5 pb-1.5 w-[160px] overflow-visible cursor-default">
        {/* Tape strip that fades in on hover */}
        <motion.div
          variants={{
            rest: { opacity: 0, scale: 0.8, rotate: -10 },
            hover: { opacity: 1, scale: 1, rotate: -10, transition: { delay: 0.05 } },
          }}
          className="absolute -top-2 -left-3 w-12 h-4 bg-amber-200/80 rounded-sm shadow-sm"
        />
        {/* "Say hi" CTA */}
        <motion.div
          variants={{
            rest: { scale: 0.6, opacity: 0, y: 6 },
            hover: { scale: 1, opacity: 1, y: 0, transition: { delay: 0.1 } },
          }}
          className="absolute -top-3 -right-3 z-10 bg-pink-500 text-white text-[9px] font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          Say hi <span>👋</span>
        </motion.div>
        <div className="w-full h-[170px] rounded-[3px] overflow-hidden bg-neutral-100">
          <img
            src={photo}
            alt="Phani Varun"
            className="w-full h-full"
            style={{ objectFit: 'cover', objectPosition: '50% 30%' }}
            draggable={false}
          />
        </div>
        <div className="text-center text-[11px] text-neutral-700 pt-2 pb-0.5 font-medium tracking-tight">
          Phani Varun
        </div>
      </div>
    </Widget>
  );
}
