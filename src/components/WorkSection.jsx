import { useRef } from 'react';
import { useInView } from 'framer-motion';
import PolaroidWidget from './widgets/PolaroidWidget';
import ClockWidget from './widgets/ClockWidget';
import MusicWidget from './widgets/MusicWidget';
import OpenToWorkWidget from './widgets/OpenToWorkWidget';
import AvailableNowWidget from './widgets/AvailableNowWidget';
import ResumeWidget from './widgets/ResumeWidget';
import LinkedInWidget from './widgets/LinkedInWidget';
import InterestsWidget from './widgets/InterestsWidget';
import LearningWidget from './widgets/LearningWidget';
import RatePortfolioWidget from './widgets/RatePortfolioWidget';
import WritingsWidget from './widgets/WritingsWidget';
import ReadingWidget from './widgets/ReadingWidget';
import MailWidget from './widgets/MailWidget';
import GitHubWidget from './widgets/GitHubWidget';
import BottomNav from './widgets/BottomNav';

export default function WorkSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full overflow-hidden bg-[#f5f5f7] md:h-screen"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Mobile headline — inline at top of stack */}
      <div className="md:hidden relative z-10 px-6 pt-20 pb-10 text-center">
        <h1 className="font-plex text-[clamp(28px,8vw,40px)] font-medium tracking-[-0.02em] text-neutral-900">
          I build <span className="italic-sharp">and</span> ship Secure.
        </h1>
      </div>

      {/* Desktop headline — absolutely centered */}
      <div className="hidden md:flex absolute inset-0 z-10 items-center justify-center pointer-events-none">
        <h1 className="font-plex text-[clamp(30px,4.4vw,56px)] font-medium tracking-[-0.02em] text-neutral-900 text-center">
          I build <span className="italic-sharp">and</span> ship Secure.
        </h1>
      </div>

      {/* Widgets — absolute floating on desktop, stacked flex column on mobile */}
      <div className="relative md:absolute md:inset-0 z-20 px-6 pb-28 md:p-0 md:pointer-events-none">
        <div className="flex flex-col items-center gap-6 md:block md:relative md:w-full md:h-full md:pointer-events-none md:[&>*]:pointer-events-auto">
          {/* Left column (desktop) */}
          <PolaroidWidget style={{ top: '8%', left: '4%' }} show={inView} />
          <ClockWidget
            style={{ top: '38%', left: '4%' }}
            location="India"
            countryCode="IN"
            timeZone="Asia/Kolkata"
            abbr="IST"
            utc="UTC+5:30"
            rotate={3}
            show={inView}
          />
          <ClockWidget
            style={{ top: '54%', left: '6%' }}
            location="New York, US"
            timeZone="America/New_York"
            abbr="EST"
            utc="UTC−5"
            rotate={-3}
            show={inView}
          />
          <InterestsWidget style={{ top: '74%', left: '4%' }} show={inView} />

          {/* Center column (desktop) */}
          <MusicWidget style={{ top: '14%', left: '50%', marginLeft: -270 }} show={inView} />
          <GitHubWidget style={{ top: '7%', left: '50%', marginLeft: 160 }} show={inView} />
          <OpenToWorkWidget style={{ top: '22%', left: '50%', marginLeft: 40 }} show={inView} />
          <RatePortfolioWidget style={{ top: '62%', left: '50%', marginLeft: -360 }} show={inView} />
          <LearningWidget style={{ top: '78%', left: '50%', marginLeft: -340 }} show={inView} />
          <WritingsWidget style={{ top: '68%', left: '50%', marginLeft: -65 }} show={inView} />
          <ReadingWidget style={{ top: '60%', left: '50%', marginLeft: 230 }} show={inView} />

          {/* Right column (desktop) */}
          <AvailableNowWidget style={{ top: '9%', right: '4%' }} show={inView} />
          <MailWidget style={{ top: '34%', right: '4%' }} show={inView} />
          <ResumeWidget style={{ top: '52%', right: '4%' }} show={inView} />
          <LinkedInWidget style={{ top: '80%', right: '4%' }} show={inView} />
        </div>
      </div>

      <BottomNav />
    </section>
  );
}
