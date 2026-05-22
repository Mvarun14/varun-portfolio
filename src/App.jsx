import Hero from './components/Hero';
import MagneticCursor from './components/MagneticCursor';
import WorkSection from './components/WorkSection';

export default function App() {
  return (
    <div className="custom-cursor-area">
      <MagneticCursor />
      <header className="fixed top-0 inset-x-0 z-50 pt-6 pb-3 text-center text-[15px] text-neutral-900 font-semibold tracking-tight pointer-events-none">
        <span className="pointer-events-auto bg-white/60 backdrop-blur-md px-3 py-1 rounded-full">
          Phani Varun
        </span>
      </header>
      <Hero />
      <WorkSection />
    </div>
  );
}
