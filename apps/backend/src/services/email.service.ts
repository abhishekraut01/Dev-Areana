import {
  otpEmailHTML,
  redis,
  generateOTP,
  hashOTP,
  verifyOTP,
  sendEmail,
  OTPError,
} from '@repo/utils';

const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS || 90);
const MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

function HandleOtpKey(email: string): string {
  return `otp:${email.toLowerCase()}`;
}

function HandleSendCountKey(email: string): string {
  return `otp_send_count:${email.toLowerCase()}`;
}

export async function sendOTP(email: string) {
  const normalized = email.toLowerCase();
  const otpKey = HandleOtpKey(normalized);
  const sendCountKey = HandleSendCountKey(normalized);

  //  Enforce daily send limit
  const currentCount = Number(await redis.get(sendCountKey)) || 0;
  if (currentCount >= MAX_ATTEMPTS) {
    throw new OTPError('RATE_LIMIT_REACHED');
  }

  //  Generate secure random OTP (6 digits)
  const otp = generateOTP(); // e.g., "928415"
  const { hash, salt } = await hashOTP(otp);

  //  Prepare OTP payload for Redis
  const payload = JSON.stringify({
    hash,
    salt,
    attempts: 0,
  });

  //  Store OTP (hashed) with expiry
  await redis.set(otpKey, payload, 'EX', OTP_TTL_SECONDS);

  //  Increment send counter atomically and expire in 24h
  await redis
    .multi()
    .incr(sendCountKey)
    .expire(sendCountKey, 24 * 60 * 60)
    .exec();

  //  Send OTP email
  const html = otpEmailHTML(otp, email, OTP_TTL_SECONDS);

  await sendEmail({
    to: email,
    subject: 'Your DevArena Login Code',
    html,
  });

  return { ok: true };
}

export const verifyOTPService = async (email: string, otp: string) => {
  const normalized = email.toLowerCase();
  const key = HandleOtpKey(normalized);

  // 1. Retrieve OTP data from Redis
  const raw = await redis.get(key);
  if (!raw) throw new OTPError('EXPIRED');

  const data = JSON.parse(raw) as {
    hash: string;
    salt: string;
    attempts: number;
  };

  // 2. Enforce max attempts rule (anti-bruteforce)
  if (data.attempts >= MAX_ATTEMPTS) {
    await redis.del(key);
    await redis.set(`otp:blocked:${normalized}`, '1', 'EX', 300); // block 5 min
    throw new OTPError('TOO_MANY_ATTEMPTS');
  }

  // 3. Verify OTP cryptographically
  const isValid = verifyOTP(otp, data.hash, data.salt);

  // 4. If invalid — increment attempt count safely
  if (!isValid) {
    data.attempts++;
    const ttl = await redis.ttl(key);

    if (ttl > 0) {
      await redis.setex(key, ttl, JSON.stringify(data)); // preserve expiry
    } else {
      await redis.del(key); // expired mid-verification
      throw new OTPError('EXPIRED');
    }

    throw new OTPError('INVALID');
  }

  // 5. OTP verified — delete it (one-time use)
  await redis.del(key);

  return true;
};
