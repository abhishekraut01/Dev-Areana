import { otpEmailHTML, redis, generateOTP, hashOTP, verifyOTP, sendEmail, OTPError } from "@repo/utils"

const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS || 90);
const MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

interface OTPData {
    hash: string;
    salt: string;
    attempts: number;
}

function HandleOtpKey(email: string): string {
    return `otp:${email.toLowerCase()}`;
}

function HandleSendCountKey(email: string): string {
    return `otp_send_count:${email.toLowerCase()}`;
}

export const sendOTP = async (email: string) => {
    const normalized = email.toLowerCase()
    //rate limit with the help to redis 
    //first we will get how many times user send the otp and if he exeed the limit of sending OTP we won't allow them to send OTP
    const sendCountKey = HandleSendCountKey(normalized)
    const sendLimit = 10 // only 10 otp requests are allowed
    const count = Number(redis.get(sendCountKey) ?? 0)
    if (count >= sendLimit) throw new Error('Rate limit reached for sending OTP');

    //generate the OTP and hash the OTP
    const OTP = generateOTP()
    const { hash, salt } = await hashOTP(OTP)

    //store the OTP with hash and other values in redis database
    const payload: OTPData = {
        hash,
        salt,
        attempts: 0
    }

    await redis.set(
        HandleOtpKey(normalized),
        JSON.stringify(payload),
        'EX',
        OTP_TTL_SECONDS
    );

    await redis.multi()
        .incr(sendCountKey)
        .expire(sendCountKey, 24 * 60 * 60)
        .exec()

    const html = otpEmailHTML(OTP, email, OTP_TTL_SECONDS)
    await sendEmail({ to: email, subject: 'Your DevArena login code', html });

    return { ok: true };
}

export const verifyOTPService = async (
    email: string,
    otp: string
) => {
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
