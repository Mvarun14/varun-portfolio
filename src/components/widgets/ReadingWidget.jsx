import { motion } from 'framer-motion';
import Widget from './Widget';
import bookCover from '../../ztoh.jpg';

export default function ReadingWidget({ style }) {
  return (
    <Widget style={style} rotate={3} hoverScale={1.03}>
      <div className="relative bg-white rounded-lg shadow-[0_22px_50px_-22px_rgba(0,0,0,0.2)] px-2 pt-2 pb-1.5 w-[140px] cursor-default">
        {/* "still reading" badge on hover */}
        <motion.div
          variants={{
            rest: { scale: 0.6, opacity: 0, y: 6 },
            hover: { scale: 1, opacity: 1, y: 0, transition: { delay: 0.1 } },
          }}
          className="absolute -top-3 -right-3 z-20 bg-pink-500 text-white text-[9px] font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          still reading <span>✦</span>
        </motion.div>

        {/* Page corner that peels on hover */}
        <motion.div
          variants={{
            rest: { rotate: 0, x: 0, opacity: 0 },
            hover: { rotate: -12, x: -4, opacity: 1, transition: { delay: 0.05 } },
          }}
          className="absolute top-2 right-2 w-3 h-3 bg-amber-200 origin-top-right shadow-sm z-10"
          style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
        />

        <div className="text-center text-[7px] tracking-[0.18em] uppercase font-semibold text-neutral-700 mb-1.5">Currently reading</div>

        <motion.div
          variants={{ rest: { y: 0 }, hover: { y: -2 } }}
          className="w-full h-[170px] rounded-md overflow-hidden border border-neutral-200"
        >
          <img src={bookCover} alt="Book cover" className="w-full h-full object-cover" />
        </motion.div>

        <div className="flex items-center gap-1.5 mt-1.5 px-1">
          <div className="flex-1 h-[2px] bg-neutral-200 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-900" style={{ width: '62%' }} />
          </div>
          <div className="text-[9px] text-neutral-500">62%</div>
        </div>
      </div>
    </Widget>
  );
}
