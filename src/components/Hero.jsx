import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Avatar from './Avatar';
import UserBubble from './chat/UserBubble';
import AssistantBubble from './chat/AssistantBubble';
import TypingBubble from './chat/TypingBubble';
import { REPLIES, classifyIntent } from './chat/replies';
import { sendMessage, OWNER_EMAIL } from './chat/sendMessage';
import { validateInput, validateEmail, validateName, checkRate, LIMITS } from '../security/validateInput';

const ArrowDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

const ArrowUpRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const SubmitIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PILLS = [
  { label: 'see my work', kind: 'work', sparkles: true, arrow: 'down' },
  { label: 'skills you have?', kind: 'skills' },
  { label: 'experience you have?', kind: 'experience' },
  { label: "what's your availability?", kind: 'availability' },
  { label: 'wanna chat?', kind: 'chat', arrow: 'upRight' },
  { label: 'resume', kind: 'resume', arrow: 'upRight' },
  { label: 'want to message?', kind: 'compose' },
];

function nearBottom(threshold = 200) {
  return (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - threshold
  );
}

// Email validation lives in security/validateInput.js; this thin wrapper keeps
// callsites readable while routing through the hardened validator.
function isValidEmail(s) {
  return validateEmail(s);
}

const chunk = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

let messageIdSeed = 0;
const newId = () => `m_${++messageIdSeed}`;

const DEFAULT_PLACEHOLDER = 'ask Varun anything...';

export default function Hero() {
  const [thread, setThread] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [usedPills, setUsedPills] = useState(new Set());
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);
  // contact = single-step (visitor drops email/handle as follow-up to availability/fallback)
  const [contactMode, setContactMode] = useState(false);
  // compose = 3-step (name → email → message)
  const [compose, setCompose] = useState({ active: false, step: null, data: {} });
  const [input, setInput] = useState('');
  const [pendingIntent, setPendingIntent] = useState(null);
  const threadEndRef = useRef(null);
  const timersRef = useRef([]);
  // Rate-limit tracker — shared across all submit paths.
  const rateTracker = useRef({ last: 0 });
  const hasThread = thread.length > 0 || isTyping;

  useEffect(() => {
    if (!threadEndRef.current) return;
    if (nearBottom()) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [thread, isTyping]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  function pushUser(text) {
    setThread((t) => [...t, { id: newId(), role: 'user', text }]);
  }
  function pushAssistant(payload) {
    setThread((t) => [...t, { id: newId(), role: 'assistant', ...payload }]);
  }

  function typeThen(fn, ms = 700 + Math.random() * 500) {
    setIsTyping(true);
    const t = setTimeout(() => {
      setIsTyping(false);
      fn();
    }, ms);
    timersRef.current.push(t);
  }

  function runReply(intent, originalText) {
    if (intent === 'compose') {
      startCompose();
      return;
    }
    const reply = REPLIES[intent] || REPLIES.fallback;
    typeThen(() => {
      pushAssistant({
        text: reply.text,
        cases: reply.cases,
        skills: reply.skills,
        timeline: reply.timeline,
        cta: reply.cta,
      });

      if (intent === 'fallback' && reply.placeholder) {
        setContactMode(true);
        setPlaceholder(reply.placeholder);
        setPendingIntent({ kind: 'fallback', originalText });
      }

      if (reply.followUp) {
        const t2 = setTimeout(() => {
          typeThen(() => {
            pushAssistant({
              text: reply.followUp.text,
              cta: reply.followUp.cta,
              choices: reply.followUp.choices,
            });
            if (reply.followUp.placeholder) {
              setContactMode(true);
              setPlaceholder(reply.followUp.placeholder);
              setPendingIntent({ kind: intent, originalText });
            }
          }, 600);
        }, reply.followUp.delay);
        timersRef.current.push(t2);
      }
    });
  }

  function startCompose() {
    setCompose({ active: true, step: 'name', data: {} });
    setPlaceholder('your name…');
    typeThen(() => pushAssistant({ text: "Sure — what's your name?" }));
  }

  async function finishCompose(data) {
    setCompose({ active: false, step: null, data: {} });
    setPlaceholder(DEFAULT_PLACEHOLDER);
    typeThen(async () => {
      pushAssistant({ text: 'Sending…' });
      const result = await sendMessage({
        name: data.name,
        email: data.email,
        message: data.message,
        subject: `New message from ${data.name} (portfolio chat)`,
      });
      if (result.ok) {
        pushAssistant({ text: `Sent! Thanks ${data.name.split(' ')[0]} — I'll reply within 24 hours.` });
      } else if (result.reason === 'not-configured') {
        pushAssistant({
          text: `Sorry, couldn't auto-send right now. Reach me directly at ${OWNER_EMAIL} and I'll get back to you.`,
        });
      } else {
        pushAssistant({
          text: `Sorry, something went wrong on send. Email me at ${OWNER_EMAIL} and I'll pick it up.`,
        });
      }
    }, 400);
  }

  function handleQuery(text, kind) {
    if (!text) return;
    if (kind === 'compose') {
      pushUser(text);
      setUsedPills((s) => new Set(s).add('compose'));
      startCompose();
      return;
    }
    pushUser(text);
    if (kind) setUsedPills((s) => new Set(s).add(kind));
    const intent = kind || classifyIntent(text);
    runReply(intent, text);
  }

  function handleChoice(messageId, choice) {
    // Mark the bubble's choices as resolved so they grey out.
    setThread((t) => t.map((m) => (m.id === messageId ? { ...m, resolved: true } : m)));
    pushUser(choice.label);
    runReply(choice.kind, choice.label);
  }

  function respondInvalid({ resetCompose = false, resetContact = false } = {}) {
    setInput('');
    if (resetCompose) {
      setCompose({ active: false, step: null, data: {} });
      setPlaceholder(DEFAULT_PLACEHOLDER);
    }
    if (resetContact) {
      setContactMode(false);
      setPendingIntent(null);
      setPlaceholder(DEFAULT_PLACEHOLDER);
    }
    pushUser('(message hidden — looked unusual)');
    const invalid = REPLIES.invalid;
    typeThen(() => pushAssistant({ text: invalid.text, cta: invalid.cta }), 300);
  }

  function respondRateLimited(preview) {
    setInput('');
    pushUser(preview.length > 80 ? `${preview.slice(0, 80)}…` : preview);
    typeThen(() => pushAssistant({ text: REPLIES.rate_limited.text }), 200);
  }

  function handleInputSubmit(e) {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    // Global rate limit — applies to every submit path.
    const rate = checkRate(rateTracker.current);
    if (!rate.ok) {
      respondRateLimited(trimmed);
      return;
    }

    // --- COMPOSE FLOW (name -> email -> message -> send) ---
    if (compose.active) {
      if (compose.step === 'name') {
        if (!validateName(trimmed)) {
          respondInvalid({ resetCompose: true });
          return;
        }
        pushUser(trimmed);
        setInput('');
        const next = { active: true, step: 'email', data: { ...compose.data, name: trimmed } };
        setCompose(next);
        setPlaceholder('your email…');
        typeThen(() => pushAssistant({ text: `Nice to meet you, ${trimmed.split(' ')[0]}! What's your email?` }));
        return;
      }
      if (compose.step === 'email') {
        if (!isValidEmail(trimmed)) {
          pushUser(trimmed);
          setInput('');
          typeThen(() => pushAssistant({ text: "That doesn't look like a valid email — mind retrying?" }), 350);
          return;
        }
        pushUser(trimmed);
        setInput('');
        const next = { active: true, step: 'message', data: { ...compose.data, email: trimmed } };
        setCompose(next);
        setPlaceholder('what would you like to say?');
        typeThen(() => pushAssistant({ text: 'Got it. What would you like to say?' }));
        return;
      }
      if (compose.step === 'message') {
        const v = validateInput(trimmed, 'message');
        if (!v.valid) {
          respondInvalid({ resetCompose: true });
          return;
        }
        pushUser(trimmed);
        setInput('');
        const data = { ...compose.data, message: trimmed };
        finishCompose(data);
        return;
      }
    }

    // --- SINGLE-FIELD CONTACT FLOW (after availability / fallback) ---
    if (contactMode) {
      // The single field accepts an email or short LinkedIn-like handle; gate
      // against payload-shaped input but allow URLs.
      const v = validateInput(trimmed, 'chat');
      if (!v.valid) {
        respondInvalid({ resetContact: true });
        return;
      }
      pushUser(trimmed);
      setInput('');
      setContactMode(false);
      setPlaceholder(DEFAULT_PLACEHOLDER);
      const intentLabel = pendingIntent?.kind === 'fallback' ? 'unrelated query' : (pendingIntent?.kind || 'reachout');
      const original = pendingIntent?.originalText ? `\nOriginal question: "${pendingIntent.originalText}"` : '';
      setPendingIntent(null);

      typeThen(async () => {
        pushAssistant({ text: 'Sending…' });
        const result = await sendMessage({
          name: 'Portfolio visitor',
          email: isValidEmail(trimmed) ? trimmed : OWNER_EMAIL,
          message: `Contact info: ${trimmed}${original}`,
          subject: `Reachout from portfolio (${intentLabel})`,
        });
        if (result.ok) {
          pushAssistant({ text: "Got it — I'll reach back within 24 hours." });
        } else if (result.reason === 'not-configured') {
          pushAssistant({
            text: `Sorry, couldn't auto-send right now. Reach me directly at ${OWNER_EMAIL} and I'll get back to you.`,
          });
        } else {
          pushAssistant({
            text: `Sorry, something went wrong on send. Email me at ${OWNER_EMAIL} and I'll pick it up.`,
          });
        }
      }, 400);
      return;
    }

    // --- NORMAL FREE-FORM QUERY ---
    const v = validateInput(trimmed, 'chat');
    if (!v.valid) {
      respondInvalid();
      return;
    }
    handleQuery(trimmed);
    setInput('');
  }

  function closeChat() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setThread([]);
    setIsTyping(false);
    setUsedPills(new Set());
    setContactMode(false);
    setCompose({ active: false, step: null, data: {} });
    setPlaceholder(DEFAULT_PLACEHOLDER);
    setPendingIntent(null);
    setInput('');
  }

  function arrowFor(pill) {
    if (pill.arrow === 'down') return <ArrowDown />;
    if (pill.arrow === 'upRight') return <ArrowUpRight />;
    return null;
  }

  return (
    <main className="bg-aurora min-h-screen w-full relative">
      <div className="blob-pink" />
      <div className="blob-violet" />

      <div className="relative z-10 mx-auto w-full max-w-[920px] px-6 sm:px-8">
        <motion.section
          className="pt-24 pb-12"
          animate={{ opacity: hasThread ? 0.25 : 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <motion.h1
            className="font-plex text-[clamp(24px,3vw,40px)] leading-[1.18] tracking-[-0.02em] font-medium text-neutral-900"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.18, delayChildren: 0.15 }}
          >
            <motion.span variants={chunk} className="inline-block align-middle">
              <Avatar />
            </motion.span>
            <motion.span variants={chunk}>I&apos;m </motion.span>
            <motion.span variants={chunk} className="selected-name">Phani&nbsp;Varun&nbsp;Munukuntla</motion.span>
            <motion.span variants={chunk}> — a Security Engineer fluent in </motion.span>
            <motion.span variants={chunk} className="italic-sharp">Application Security, GenAI and Backend Systems</motion.span>
            <motion.span variants={chunk}>. Based in the US and India, available to teams shipping AI they can actually trust, from first commit to production.</motion.span>
          </motion.h1>
        </motion.section>

        <section className="relative space-y-4 pb-6">
          <AnimatePresence>
            {hasThread && (
              <motion.button
                key="close-thread"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                onClick={closeChat}
                aria-label="Close chat"
                className="sticky top-20 z-30 ml-auto flex items-center gap-1 bg-white/90 backdrop-blur-md border border-neutral-200/70 text-neutral-700 hover:text-neutral-900 hover:bg-white text-[11px] font-medium px-2.5 py-1.5 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-colors"
              >
                <CloseIcon />
                <span>clear</span>
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {thread.map((msg) =>
              msg.role === 'user' ? (
                <UserBubble key={msg.id} text={msg.text} />
              ) : (
                <AssistantBubble
                  key={msg.id}
                  message={msg}
                  onChoice={(c) => handleChoice(msg.id, c)}
                />
              )
            )}
            {isTyping && <TypingBubble key="typing-indicator" />}
          </AnimatePresence>
          <div ref={threadEndRef} />
        </section>

        <section className="pb-24">
          <div className="flex flex-wrap gap-2 mb-3">
            {PILLS.map((p) => {
              const used = usedPills.has(p.kind);
              return (
                <button
                  key={p.label}
                  onClick={() => handleQuery(p.label, p.kind)}
                  disabled={used}
                  className={`pill ${p.sparkles && !used ? 'pill-active' : ''} ${used ? 'pill-used' : ''}`}
                >
                  {p.sparkles && !used && (
                    <>
                      <span className="sparkle sparkle-1">✦</span>
                      <span className="sparkle sparkle-2">✦</span>
                      <span className="sparkle sparkle-3">✦</span>
                    </>
                  )}
                  <span>{p.label}</span>
                  {arrowFor(p)}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleInputSubmit} className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-[13px] tracking-tight pointer-events-none">
              &gt;_
            </span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder={placeholder}
              className="ask-input pr-14"
              autoComplete="off"
              spellCheck="true"
              maxLength={compose.step === 'message' ? LIMITS.message : LIMITS.chat}
              aria-label="Ask Varun anything"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                input.trim()
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-md'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <SubmitIcon />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
