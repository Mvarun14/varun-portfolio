// Client-side input hardening for the chat surface.
// Defense in depth — React already escapes rendered output, but we also want to:
//   1. Reject inputs that look like injection payloads (XSS / SQLi / shell / path traversal),
//   2. Cap length to keep the UI and outbound email sane,
//   3. Rate-limit submissions to slow down automated abuse.
// Genuine questions in plain English will never trip these checks.

export const LIMITS = {
  chat: 500,
  message: 2000,
  name: 80,
  email: 254,
};

// Reject NULL + control bytes (0x00-0x08, 0x0B, 0x0C, 0x0E-0x1F, 0x7F).
// Tab (0x09) and newline (0x0A) are deliberately allowed.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = new RegExp('[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]');

const SUSPICIOUS_PATTERNS = [
  // HTML / script injection
  /<\s*\/?\s*script\b/i,
  /<\s*\/?\s*iframe\b/i,
  /<\s*\/?\s*object\b/i,
  /<\s*\/?\s*embed\b/i,
  /<\s*\/?\s*svg\b/i,
  /<\s*\/?\s*link\b/i,
  /<\s*\/?\s*style\b/i,
  /<\s*\/?\s*meta\b/i,
  /<\s*img\b[^>]*\bon\w+\s*=/i,
  // Dangerous URL schemes
  /\bjavascript\s*:/i,
  /\bvbscript\s*:/i,
  /\bdata\s*:\s*text\/html/i,
  // Inline event handlers
  /\bon(error|load|click|mouseover|mouseenter|focus|blur|submit|change|input|keydown|keyup|keypress|toggle|animationend|transitionend)\s*=/i,
  // JS sink calls
  /\beval\s*\(/i,
  /\bnew\s+Function\s*\(/i,
  /\bsetTimeout\s*\(\s*['"`]/i,
  /\bsetInterval\s*\(\s*['"`]/i,
  /\bdocument\s*\.\s*(cookie|domain|write|writeln)/i,
  /\bwindow\s*\.\s*(location|name)\s*=/i,
  /\.\s*innerHTML\s*=/i,
  // SQL injection markers
  /\bunion\s+select\b/i,
  /\bdrop\s+table\b/i,
  /\binsert\s+into\b[\s\S]{0,40}\bvalues\b/i,
  /\bdelete\s+from\b/i,
  /\bselect\b[\s\S]{0,40}\bfrom\b[\s\S]{0,40}\bwhere\b/i,
  /'\s*or\s+'?\d+'?\s*=\s*'?\d+/i,
  /'\s*--/i,
  // Shell / command injection
  /[`$]\s*\(/,
  /;\s*(rm|cat|curl|wget|nc|bash|sh|powershell|cmd|chmod|chown|kill)\s+\S/i,
  /\|\s*(nc|curl|wget|bash|sh|powershell)\s+\S/i,
  /&&\s*(rm|cat|curl|wget|nc|bash|sh)\s+\S/i,
  // Path traversal
  /\.\.[\\/]/,
];

export function validateInput(raw, kind = 'chat') {
  if (raw == null) return { valid: false, reason: 'empty' };
  const text = String(raw);
  const trimmed = text.trim();
  if (!trimmed) return { valid: false, reason: 'empty' };

  const max = LIMITS[kind] ?? LIMITS.chat;
  if (text.length > max) return { valid: false, reason: 'too_long' };

  if (CONTROL_CHARS.test(text)) return { valid: false, reason: 'suspicious' };

  // Repeated-character spam (e.g. "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa").
  if (/(.)\1{29,}/.test(text)) return { valid: false, reason: 'suspicious' };

  for (const re of SUSPICIOUS_PATTERNS) {
    if (re.test(text)) return { valid: false, reason: 'suspicious' };
  }

  return { valid: true, value: trimmed };
}

export function validateEmail(raw) {
  const text = String(raw || '').trim();
  if (!text || text.length > LIMITS.email) return false;
  // Reject CRLF / header-injection chars and HTML angle brackets.
  if (/[\r\n<>"\\]/.test(text)) return false;
  if (CONTROL_CHARS.test(text)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

export function validateName(raw) {
  const text = String(raw || '').trim();
  if (!text || text.length > LIMITS.name) return false;
  if (/[\r\n<>]/.test(text)) return false;
  if (CONTROL_CHARS.test(text)) return false;
  return true;
}

// Minimal rate limiter — caller passes a mutable tracker `{ last: number }`.
// Keeps the chat from being machine-gunned. Not a security boundary on its own.
export function checkRate(tracker, { minIntervalMs = 800 } = {}) {
  const now = Date.now();
  const last = tracker.last || 0;
  if (now - last < minIntervalMs) {
    return { ok: false, waitMs: minIntervalMs - (now - last) };
  }
  tracker.last = now;
  return { ok: true };
}
