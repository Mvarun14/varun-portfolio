import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <motion.section
        className="not-found-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
      >
        <div className="not-found-kicker">404</div>
        <h1>You drifted off the portfolio map.</h1>
        <p>This route does not exist, but the good paths are still close.</p>
        <div className="not-found-actions">
          <a className="not-found-button premium-action" href="/">
            Back to portfolio
          </a>
        </div>
      </motion.section>
    </main>
  );
}
