import 'server-only';
import nodemailer from 'nodemailer';

function configured() {
  return Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

export async function sendEmail({ to, subject, html, text }) {
  if (!configured()) {
    console.info('[email:development]', { to, subject, text: text || html?.replace(/<[^>]+>/g, ' ') });
    return { delivered: false, development: true };
  }
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || 'JetWash <no-reply@jetwash.co.zw>',
    to, subject, text, html
  });
}

export function emailShell(title, body) {
  return `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#102033"><div style="background:#0d2233;color:white;padding:24px;border-radius:12px 12px 0 0"><strong>JetWash [PVT] LTD</strong></div><div style="padding:28px;border:1px solid #dbe5f2;border-top:0"><h1 style="font-size:24px">${title}</h1>${body}<p style="margin-top:28px;color:#607080">Industrial precision, delivered safely.</p></div></div>`;
}
