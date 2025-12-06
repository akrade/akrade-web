import nodemailer from 'nodemailer';

interface SendConfirmationEmailOptions {
  to: string;
  token: string;
  origin?: string | null;
  consentCopy?: string;
  formUrl?: string;
}

const env = (key: string) => process.env[key] || (import.meta as any).env?.[key];

export async function sendConfirmationEmail(options: SendConfirmationEmailOptions) {
  const { to, token, origin, consentCopy, formUrl } = options;

  const host = env('AKRADE_SMTP_HOST');
  const port = Number(env('AKRADE_SMTP_PORT') || 587);
  const user = env('AKRADE_SMTP_USER');
  const pass = env('AKRADE_SMTP_PASS');
  const from = env('AKRADE_SMTP_FROM') || user;
  const siteUrl = (env('AKRADE_SITE_URL') || origin || '').replace(/\/$/, '');

  if (!host || !user || !pass || !from) {
    throw new Error('Missing SMTP configuration (AKRADE_SMTP_HOST/PORT/USER/PASS/FROM)');
  }

  const confirmUrl = `${siteUrl || ''}/confirm?token=${encodeURIComponent(token)}`;

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  const subject = 'Confirm your subscription';
  const text = [
    'Thanks for subscribing!',
    '',
    'Please confirm your subscription by clicking the link below:',
    confirmUrl,
    '',
    'If you did not request this, you can ignore this email.',
    formUrl ? `Form URL: ${formUrl}` : '',
    consentCopy ? `Consent: ${consentCopy}` : ''
  ].filter(Boolean).join('\n');

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111;">
      <p>Thanks for subscribing!</p>
      <p>Please confirm your subscription:</p>
      <p><a href="${confirmUrl}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">Confirm my subscription</a></p>
      <p>Or copy and paste this link:<br /><a href="${confirmUrl}">${confirmUrl}</a></p>
      ${consentCopy ? `<p style="font-size:12px;color:#555;">Consent: ${consentCopy}</p>` : ''}
      ${formUrl ? `<p style="font-size:12px;color:#555;">Form URL: ${formUrl}</p>` : ''}
      <p style="font-size:12px;color:#777;">If you did not request this, you can ignore this email.</p>
    </div>
  `;

  await transport.sendMail({
    from,
    to,
    subject,
    text,
    html
  });

  return { ok: true, confirmUrl };
}
