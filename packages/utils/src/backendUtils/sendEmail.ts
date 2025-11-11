import { resend } from './resend.js';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (options: SendEmailOptions) => {
  const emailFrom = process.env.EMAIL_FROM as string;
  const { to, subject, html, from = emailFrom } = options;

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error('Failed to send email:', result.error);
      throw new Error(result.error.message);
    }

    console.log(`Email sent successfully to ${to}`);
    return result.data;
  } catch (error) {
    console.error('Resend API error:', error);
    throw new Error('Email sending failed');
  }
};
