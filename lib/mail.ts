import 'server-only';
import nodemailer from 'nodemailer';

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

/**
 * Lazy-initialized transporter to avoid top-level execution of Node.js logic
 * which can cause client-side crashes if the module is traced into a bundle.
 */
let transporter: any = null;

function getTransporter() {
  if (transporter) return transporter;
  
  const host = process.env.SMTP_HOST || '';
  const user = process.env.SMTP_USER || '';
  const port = parseInt(process.env.SMTP_PORT || '587');
  
  // Explicitly check for security preference, otherwise fallback to port-based detection
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || host.includes('example.com') || !user || user.includes('example.com')) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️  WARNING: SMTP is using placeholders (example.com). Emails will NOT be delivered.');
    console.warn('\x1b[33m%s\x1b[0m', '   Please update SMTP_HOST, SMTP_USER, and SMTP_PASS in your Vercel Dashboard.');
  }

  console.log('--- Initializing SMTP Transporter (Port:', port, 'Secure:', secure, ') ---');
  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: process.env.SMTP_PASS || '',
    },
    // Add connection timeout
    connectionTimeout: 10000, 
    greetingTimeout: 10000,
  });
  return transporter;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  attachments,
  replyTo,
}: SendEmailParams) {
  const host = (process.env.SMTP_HOST || '').trim();
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();

  if (!host || !user || !pass) {
    const msg =
      'SMTP is not configured: set SMTP_HOST, SMTP_USER, and SMTP_PASS in your server environment (e.g. Vercel → Settings → Environment Variables), then redeploy.';
    console.error(msg);
    return { success: false, error: msg };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || '"Checkin Me" <noreply@checkin-me.com>';
  
  try {
    const activeTransporter = getTransporter();
    const info = await activeTransporter.sendMail({
      from,
      to,
      subject,
      text,
      html: html || text,
      attachments,
      ...(replyTo ? { replyTo } : {}),
    });
    console.log('Email successfully sent to:', to, ' - MessageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('CRITICAL SMTP ERROR:');
    console.error('- To:', to);
    console.error('- Subject:', subject);
    console.error('- Error Message:', error.message);
    console.error('- Full Error Object:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message };
  }
}
