function reply(status, sent) {
  return Response.json({sent}, {status, headers:{'Cache-Control':'no-store'}});
}

async function contact(request, env) {
  if (request.method !== 'POST') return new Response(null, {status:405, headers:{Allow:'POST'}});
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type') || '')) return reply(415, false);
  if (Number(request.headers.get('Content-Length')) > 32768) return reply(413, false);
  let data;
  try {
    const raw = await request.text();
    if (raw.length > 32768) return reply(413, false);
    data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return reply(400, false);
  } catch {
    return reply(400, false);
  }
  const fields = ['nom', 'email', 'message'];
  if (!fields.every(key => typeof data[key] === 'string' && data[key].trim())) {
    return reply(400, false);
  }
  const [name, email, message] = fields.map(key => data[key].trim());
  if (name.length > 120 || email.length > 254 || message.length > 5000 ||
      /[\r\n]/.test(name) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply(400, false);
  }
  const {RESEND_API_KEY, CONTACT_FROM} = env;
  if (!RESEND_API_KEY || !CONTACT_FROM) return reply(503, false);
  try {
    const delivery = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{Authorization:'Bearer ' + RESEND_API_KEY, 'Content-Type':'application/json'},
      body:JSON.stringify({
        from:CONTACT_FROM, to:['contact@picturial.fr'], reply_to:email,
        subject:'Contact Picturial — ' + name, text:message + '\n\n' + name + '\n' + email
      })
    });
    const receipt = await delivery.json();
    if (!delivery.ok || !receipt.id) return reply(502, false);
    return reply(200, true);
  } catch {
    return reply(502, false);
  }
}

export default {
  fetch(request, env) {
    if (new URL(request.url).pathname === '/api/contact') return contact(request, env);
    return env.ASSETS.fetch(request);
  }
};
