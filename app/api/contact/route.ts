import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactRecipient = process.env.CONTACT_RECIPIENT_EMAIL;
    const contactSender = process.env.CONTACT_SENDER_EMAIL || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass || !contactRecipient || !contactSender) {
      return NextResponse.json(
        {
          error:
            'Email configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_RECIPIENT_EMAIL and CONTACT_SENDER_EMAIL.',
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const subject = `Nouveau message contact - ${name}`;
    const text = [
      `Nom: ${name}`,
      `Email: ${email}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2>Nouveau message depuis le formulaire de contact</h2>
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `Locars <${contactSender}>`,
      to: contactRecipient,
      replyTo: email,
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
