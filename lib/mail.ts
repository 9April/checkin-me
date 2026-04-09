import nodemailer from 'nodemailer';

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function sendEmail({ to, subject, text, html, attachments }: SendEmailParams) {
  const from = process.env.SMTP_FROM || '"Checkin Me" <noreply@checkin-me.com>';
  
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: html || text,
      attachments,
    });
    console.log('Email successfully sent to:', to, ' - MessageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('SMTP Error details:');
    console.error('- Code:', error.code);
    console.error('- Command:', error.command);
    console.error('- Message:', error.message);
    return { success: false, error: error.message };
  }
}
