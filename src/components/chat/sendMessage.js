import { WEB3FORMS_ACCESS_KEY, OWNER_EMAIL } from '../../links';

/**
 * Send a visitor message to the portfolio owner's inbox via Web3Forms.
 * Returns `{ ok: true }` on success, `{ ok: false, reason }` on failure.
 *
 * Until WEB3FORMS_ACCESS_KEY is filled in, this short-circuits and returns
 * `{ ok: false, reason: 'not-configured' }` so the UI can show a graceful
 * fallback (e.g. "email me directly at ...").
 */
export async function sendMessage({ name, email, message, subject } = {}) {
  if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
    return { ok: false, reason: 'not-configured' };
  }
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name: name || 'Portfolio visitor',
        email: email || 'no-reply@example.com',
        subject: subject || 'New message from portfolio',
        message: message || '(no message)',
        from_name: 'Portfolio chat',
      }),
    });
    if (!res.ok) return { ok: false, reason: `http_${res.status}` };
    const data = await res.json().catch(() => ({}));
    if (data && data.success === false) return { ok: false, reason: 'rejected' };
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: 'network' };
  }
}

export { OWNER_EMAIL };
