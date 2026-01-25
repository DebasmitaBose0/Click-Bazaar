#!/usr/bin/env node
/*
  Lightweight demo server to accept /subscribe and forward to SendGrid.
  - Node 18+ (global fetch)
  - Usage:
      SENDGRID_API_KEY=... SENDER_EMAIL=you@yourdomain.com node scripts/sendgrid-subscribe-example.cjs
      or use dotenv with a .env file
*/
const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 7777;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_NAME = process.env.SENDER_NAME || 'Click Bazaar';

if (!SENDGRID_API_KEY || !SENDER_EMAIL) {
  console.warn('\n⚠️  Missing environment variables for SendGrid demo server.');
  console.warn('Set SENDGRID_API_KEY and SENDER_EMAIL before running this script.');
  console.warn('Example: SENDGRID_API_KEY=xxx SENDER_EMAIL=you@domain.com node scripts/sendgrid-subscribe-example.cjs\n');
}

const jsonResponse = (res, status, obj) => {
  const body = JSON.stringify(obj || {});
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
};

const handleSubscribe = async (email) => {
  if (!/\S+@\S+\.\S+/.test(email)) throw new Error('Invalid email');
  if (!SENDGRID_API_KEY) throw new Error('SENDGRID_API_KEY not configured');
  if (!SENDER_EMAIL) throw new Error('SENDER_EMAIL not configured');

  // 1) Add to Marketing Contacts (idempotent)
  const addContact = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ contacts: [{ email }] })
  });
  if (!addContact.ok) {
    const txt = await addContact.text().catch(() => '<no body>');
    throw new Error('SendGrid contacts error: ' + addContact.status + ' ' + txt);
  }

  // 2) Send a transactional confirmation email
  const payload = {
    personalizations: [{ to: [{ email }], subject: 'Welcome to Click Bazaar' }],
    from: { email: SENDER_EMAIL, name: SENDER_NAME },
    content: [{ type: 'text/plain', value: `Thanks for subscribing to Click Bazaar! We'll send occasional updates.` }]
  };

  const send = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!send.ok) {
    const txt = await send.text().catch(() => '<no body>');
    throw new Error('SendGrid mail/send error: ' + send.status + ' ' + txt);
  }

  return true;
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === 'POST' && url.pathname === '/subscribe') {
    try {
      let body = '';
      for await (const chunk of req) body += chunk;
      const data = JSON.parse(body || '{}');
      if (!data.email) return jsonResponse(res, 400, { error: 'missing email' });
      await handleSubscribe(String(data.email));
      return jsonResponse(res, 200, { ok: true });
    } catch (err) {
      console.error('subscribe error', err?.message || err);
      return jsonResponse(res, err.message && err.message.includes('not configured') ? 501 : 500, { error: err.message });
    }
  }

  // health
  if (req.method === 'GET' && url.pathname === '/') {
    return jsonResponse(res, 200, { ok: true, note: 'SendGrid demo endpoint. POST /subscribe { email }' });
  }

  jsonResponse(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  console.log(`SendGrid demo server listening on http://localhost:${PORT}`);
  if (!SENDGRID_API_KEY) console.log('⚠️  RUNNING WITHOUT SENDGRID_API_KEY — endpoint will return 501 until configured');
  console.log('POST /subscribe { "email": "you@example.com" }');
});
