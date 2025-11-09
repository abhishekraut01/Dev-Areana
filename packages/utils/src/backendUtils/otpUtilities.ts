import crypto from 'crypto'

const OTP_LENGTH = 6

export const generateOTP = (): string => {
    const min = 10 ** (OTP_LENGTH - 1); // 100000
    const max = 10 ** OTP_LENGTH - 1;   // 999999
    const OTP = crypto.randomInt(min , max+1)
    return String(OTP)
}


export async function hashOTP(otp: string, salt?: string) {
  const s = salt ?? crypto.randomBytes(16).toString('hex');
  
  const hash = await new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(otp, s, 100_000, 64, 'sha512', (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });

  return { hash, salt: s };
}

export async function verifyOTP(otp: string, hash: string, salt: string) {
  const testHash = await new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(otp, salt, 100_000, 64, 'sha512', (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });

  // Use timing-safe comparison
  const valid = crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
  return valid;
}