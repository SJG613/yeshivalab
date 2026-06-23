const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254;
const MAX_NAME_LEN = 120;

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(init.headers || {}),
    },
  });
}

function clean(value, max) {
  return String(value || '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function getClientIp(request) {
  return request.headers.get('cf-connecting-ip')
    || request.headers.get('x-forwarded-for')
    || '';
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.WAITLIST) {
    return json({
      ok: false,
      code: 'waitlist_not_configured',
      error: 'The waitlist is not wired yet. Please email steve@aicoolschool.com.',
    }, { status: 503 });
  }

  let body;
  try {
    const type = request.headers.get('content-type') || '';
    if (type.includes('application/json')) {
      body = await request.json();
    } else {
      const form = await request.formData();
      body = Object.fromEntries(form.entries());
    }
  } catch (_) {
    return json({ ok: false, error: 'Could not read the form. Please try again.' }, { status: 400 });
  }

  // Honeypot. Real users never fill this; simple bots often do.
  if (clean(body.website, 200)) {
    return json({ ok: true });
  }

  const email = clean(body.email, MAX_EMAIL_LEN).toLowerCase();
  const name = clean(body.name, MAX_NAME_LEN);

  if (!email || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const record = {
    email,
    name,
    source: 'yeshivalab.net coming soon',
    created_at: now,
    ip: getClientIp(request),
    user_agent: request.headers.get('user-agent') || '',
  };

  const key = `email:${email}`;
  await env.WAITLIST.put(key, JSON.stringify(record), {
    metadata: { email, source: 'yeshivalab' },
  });

  return json({ ok: true, message: 'You’re on the YeshivaLab launch list.' });
}

export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}
