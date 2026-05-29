import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactRecipient = process.env.CONTACT_RECIPIENT_EMAIL || 'contact@locars.app';
    const contactSender = process.env.CONTACT_SENDER_EMAIL || 'Locars <onboarding@resend.dev>';

    if (!resendApiKey) {
      return NextResponse.json(
        {
          error:
            'Email configuration is missing. Set RESEND_API_KEY and, if needed, CONTACT_RECIPIENT_EMAIL / CONTACT_SENDER_EMAIL.',
        },
        { status: 500 },
      );
    }

    const resend = new Resend(resendApiKey);

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

    const { error } = await resend.emails.send({
      from: contactSender,
      to: contactRecipient,
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
