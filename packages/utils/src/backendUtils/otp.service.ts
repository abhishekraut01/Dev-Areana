import crypto from 'crypto';
import { otpEmailHTML } from './emailTemplates';
import { sendEmail } from './email';

export const sendOTPEmail = async (email: string) => {
  // 1. Generate secure 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // 2. (Optional) Save OTP to DB or cache (Redis)
  // await prisma.otp.create({ data: { email, otp, expiresAt } });

  // 3. Generate HTML using your template
  const html = otpEmailHTML(otp, email);

  // 4. Send the email
  await sendEmail({
    to: email,
    subject: 'Your DevArena Login Code',
    html,
  });

  console.log(`🔐 OTP ${otp} sent to ${email}`);
  return otp; // Return for debugging / testing, not in production response
};
