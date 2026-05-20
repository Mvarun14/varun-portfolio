import { CALENDAR_URL, RESUME_URL, GITHUB_URL } from '../../links';
import policyImg from '../../policy.jpeg';
import webappImg from '../../webapp.jpeg';
import apiImg from '../../api.jpeg';
import cloudsecImg from '../../cloudsec.jpeg';

// Devicon CDN — drop any icon by name + variant.
const dev = (name, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;
// Simple Icons CDN — used for logos Devicon doesn't carry (e.g. AI/security tools).
const si = (slug, color = '000000') => `https://cdn.simpleicons.org/${slug}/${color}`;

const SKILLS = [
  { name: 'Python', icon: dev('python') },
  { name: 'Java', icon: dev('java') },
  { name: 'JavaScript', icon: dev('javascript') },
  { name: 'React', icon: dev('react') },
  { name: 'Tailwind CSS', icon: dev('tailwindcss') },
  { name: 'HTML', icon: dev('html5') },
  { name: 'CSS', icon: dev('css3') },
  { name: 'MongoDB', icon: dev('mongodb') },
  { name: 'MySQL', icon: dev('mysql') },
  { name: 'Docker', icon: dev('docker') },
  { name: 'GitHub', icon: dev('github') },
  { name: 'Kali Linux', icon: si('kalilinux', '557C94') },
  { name: 'VS Code', icon: dev('vscode') },
  { name: 'AWS', icon: dev('amazonwebservices', 'original-wordmark') },
  { name: 'GCP', icon: dev('googlecloud') },
  { name: 'Azure', icon: dev('azure') },
  { name: 'Splunk', icon: si('splunk', '000000') },
  { name: 'Burp Suite', icon: si('burpsuite', 'FF6633') },
  { name: 'OWASP ZAP', icon: si('owasp', '000000') },
  { name: 'Flask', icon: dev('flask') },
  { name: 'Django', icon: dev('django', 'plain') },
];

// Reply templates keyed by intent.
export const REPLIES = {
  work: {
    text: 'four projects I shipped and would build again.',
    cases: [
      {
        title: 'Policy Driven Code Reviewer',
        subtitle: 'Static Analysis, GenAI',
        tag: 'POL',
        image: policyImg,
      },
      {
        title: 'Web Application Security, Automation & CI Validation Framework',
        subtitle: 'AppSec, CI/CD',
        tag: 'WEB',
        image: webappImg,
      },
      {
        title: 'Adaptive API Risk Gate',
        subtitle: 'Runtime API security',
        tag: 'API',
        image: apiImg,
      },
      {
        title: 'Secure Cloud File Management',
        subtitle: 'Cloud Security',
        tag: 'CLD',
        image: cloudsecImg,
      },
    ],
    followUp: {
      delay: 800,
      text: "Want the full list? Everything I've built lives on my GitHub.",
      cta: { label: 'Explore on GitHub', href: GITHUB_URL },
    },
  },
  skills: {
    text: 'the stack I reach for — security, backend, and AI.',
    skills: SKILLS,
  },
  experience: {
    text: "One year of focused work in application security, backend engineering, and AI security, extended through open-source contributions, side projects, and deep self-study into Agentic AI and GenAI failure modes. Comfortable owning a feature from first commit through to incident response.",
    followUp: {
      delay: 800,
      text: "Want to see my experience in detail?",
      choices: [
        { label: 'Yes', value: 'yes', kind: 'experience_detail' },
        { label: 'No', value: 'no', kind: 'experience_skip' },
      ],
    },
  },
  experience_detail: {
    text: "Here's the full timeline — most recent first.",
    timeline: [
      {
        dates: 'MAR 2025 — DEC 2025',
        location: 'Buffalo, USA',
        title: 'Graduate Assistant — Software Security',
        company: 'University at Buffalo, State University of New York',
        bullets: [
          'Analysed and modified application source code to identify and remediate security vulnerabilities using secure coding practices.',
          'Implemented input validation and authentication logic through code changes to reduce application-level security risks.',
          'Applied threat modelling concepts to drive secure design decisions and guide design-informed code modifications.',
          'Performed static and dynamic security testing, iterating on code fixes to validate remediations.',
        ],
      },
      {
        dates: 'MAY 2023 — JUL 2023',
        location: 'Virtual Internship',
        title: 'Network Security Associate',
        company: 'EduSkills Foundation® — Supported by Fortinet',
        bullets: [
          'Analysed network traffic logs using Wireshark to detect anomalies and gain insights into potential threats.',
          'Simulated common network-based attacks to study their behaviour and evaluate defence strategies.',
          'Explored and recommended security policies covering firewalls, IDS/IPS, and access control measures.',
        ],
      },
      {
        dates: 'SEP 2022 — NOV 2022',
        location: 'Virtual Internship',
        title: 'Information Security Administrator',
        company: 'Virtually Testing Foundation',
        bullets: [
          'Conducted web application vulnerability assessments aligned with OWASP Top 10, identifying and documenting risks.',
          'Analysed simulated attack scenarios using MITRE ATT&CK, mapping threats to relevant tactics and techniques.',
          'Collaborated on mock incident response exercises, refining analysis and reporting skills.',
        ],
      },
    ],
  },
  experience_skip: {
    text: "All good — let me know if you want to dive in later.",
  },
  identity: {
    text: "Security engineer who sits at the design table so threat-model output is something engineers and PMs actually use.",
  },
  availability: {
    text: 'Currently exploring new opportunities focused on Backend and AI security across production systems. Open to full-time, contract, or short engagements. Based in India and the US, open to relocate.',
    followUp: {
      delay: 700,
      text: "Easiest way to reach me — drop your email or LinkedIn handle and I'll reply within 24 hours.",
      placeholder: 'your email or LinkedIn…',
    },
  },
  chat: {
    text: 'Easiest is a 30-minute call — no agenda needed.',
    cta: { label: 'Book a call', href: CALENDAR_URL },
  },
  resume: {
    text: 'One page, the real story.',
    cta: { label: 'Download resume', href: RESUME_URL, icon: 'download' },
  },
  // Catch-all for anything unrelated to the portfolio.
  fallback: {
    text: "Thanks for the message! Drop your email or LinkedIn and I'll get back to you personally.",
    placeholder: 'your email or LinkedIn…',
  },
  thanks: {
    text: "Got it — I'll reach back within 24 hours.",
  },
};

// Broad keyword groups — each match wins the corresponding intent.
const INTENT_KEYWORDS = {
  work: [
    'work', 'case', 'case study', 'case studies', 'project', 'projects', 'portfolio',
    'shipped', 'ship list', 'built', 'made', 'done', 'examples', 'show me', 'see your',
  ],
  skills: [
    'skill', 'skills', 'tech', 'stack', 'tools', 'tooling', 'languages', 'know',
    'tech stack', 'what do you use', 'what use', 'what.*use',
  ],
  availability: [
    'avail', 'available', 'hire', 'hiring', 'free', 'open', 'when can', 'right now',
    'this week', 'next week', 'job', 'role', 'position', 'remote', 'onsite', 'relocate',
    'looking for', 'considering',
  ],
  chat: [
    'chat', 'call', 'meet', 'talk', 'coffee', 'connect', 'reach out', 'hop on',
    'quick call', 'schedule', 'meeting', 'book',
  ],
  resume: [
    'resume', 'cv', 'download', 'pdf', 'one pager', 'one-pager',
  ],
  experience: [
    'experience', 'years', 'how long', 'background', 'history', 'past', 'worked',
    'career', 'where have you', 'how many years',
  ],
  identity: [
    'designer', 'design', 'who are you', 'tell me about',
    'about you', 'who is', 'introduce',
  ],
};

export function classifyIntent(text) {
  const t = (text || '').toLowerCase().trim();
  if (!t) return 'fallback';
  // Score-based matching so longer phrases win over short stems.
  let best = { intent: 'fallback', score: 0 };
  for (const [intent, words] of Object.entries(INTENT_KEYWORDS)) {
    for (const w of words) {
      if (t.includes(w)) {
        const score = w.length;
        if (score > best.score) best = { intent, score };
      }
    }
  }
  return best.intent;
}
