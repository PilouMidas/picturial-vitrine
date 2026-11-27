const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost(context) {
  let data;
  try {
    data = await context.request.json();
  } catch {
    return Response.json({ sent: false }, { status: 400 });
  }
  const nom = String(data.nom ?? "").trim();
  const email = String(data.email ?? "").trim();
  const message = String(data.message ?? "").trim();
  if (!nom || nom.length > 120 || !EMAIL_RE.test(email) || email.length > 254 || !message || message.length > 5000) {
    return Response.json({ sent: false }, { status: 400 });
  }
  const to = context.env.CONTACT_RECIPIENT || "contact@picturial.fr";
  try {
    await context.env.SEND_EMAIL.send({
      from: "Site Picturial <contact@picturial.fr>",
      to,
      reply_to: `${nom} <${email}>`,
      subject: `Nouveau message du site — ${nom}`,
      text: `Nom : ${nom}\nEmail : ${email}\n\n${message}`,
    });
  } catch {
    return Response.json({ sent: false }, { status: 502 });
  }
  return Response.json({ sent: true });
}

export async function onRequest() {
  return Response.json({ sent: false }, { status: 405 });
}
