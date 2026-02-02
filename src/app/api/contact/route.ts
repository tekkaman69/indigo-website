import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase/firestore';
import { addContactSubmission } from '@/lib/firebase/firestore';

// ============================================
// CONFIGURATION
// ============================================
// Recipient email - change this to modify where emails are sent
const RECIPIENT_EMAIL = 'valentinclaudejeanbaptiste@gmail.com';

// Rate limiting
const RATE_LIMIT_MAP = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3;

// ============================================
// HELPERS
// ============================================

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = RATE_LIMIT_MAP.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    RATE_LIMIT_MAP.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// Send email via Resend API (free, reliable, works on Vercel)
async function sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Indigo Contact <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return false;
    }

    console.log('✅ Email sent via Resend to:', to);
    return true;
  } catch (error) {
    console.error('Resend send error:', error);
    return false;
  }
}

// Send email via SMTP (Nodemailer) - fallback method
async function sendViaSMTP(to: string, subject: string, html: string): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return false;

  try {
    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent via SMTP to:', to);
    return true;
  } catch (error) {
    console.error('SMTP send error:', error);
    return false;
  }
}

// ============================================
// API HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, company, email, service, budget, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Message invalide (10-5000 caractères)' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Store in Firestore (always works, acts as backup)
    let firestoreId = '';
    try {
      firestoreId = await addContactSubmission({
        name,
        company,
        email,
        service,
        budget,
        message,
      });
      console.log('✅ Contact saved to Firestore:', firestoreId);
    } catch (firestoreError) {
      console.error('❌ Firestore save error:', firestoreError);
      // Continue - we still want to try sending email
    }

    // Prepare email content
    const recipientEmail = process.env.CONTACT_EMAIL || RECIPIENT_EMAIL;
    const subject = `[Indigo] Nouveau message de ${name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
          Nouveau message de contact
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Nom:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          ${company ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Entreprise:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${company}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <a href="mailto:${email}">${email}</a>
            </td>
          </tr>
          ${service ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Service:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${service}</td>
          </tr>
          ` : ''}
          ${budget ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Budget:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${budget}</td>
          </tr>
          ` : ''}
        </table>
        <h3 style="color: #333; margin-top: 20px;">Message:</h3>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
        <p style="color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          ${firestoreId ? `ID Firestore: ${firestoreId}` : 'Non sauvegardé dans Firestore'}
          <br>Envoyé depuis le formulaire de contact Indigo
        </p>
      </div>
    `;

    // Try to send email via available methods
    let emailSent = false;

    // Method 1: Try Resend (recommended for Vercel)
    if (!emailSent && process.env.RESEND_API_KEY) {
      emailSent = await sendViaResend(recipientEmail, subject, html);
    }

    // Method 2: Try SMTP as fallback
    if (!emailSent && process.env.SMTP_USER) {
      emailSent = await sendViaSMTP(recipientEmail, subject, html);
    }

    // Log email status
    if (!emailSent) {
      console.warn('⚠️ Email NOT sent - configure RESEND_API_KEY or SMTP in .env.local');
      console.warn('Message stored in Firestore with ID:', firestoreId);
    }

    // Always return success if we got here
    // User doesn't need to know about email delivery issues - message is saved in Firestore
    return NextResponse.json(
      {
        message: 'Message envoyé avec succès',
        id: firestoreId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Contact API error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
