import crypto from 'crypto'

const OTP_LENGTH = 6

export const generateOTP = (): string => {
    const min = 10 ** (OTP_LENGTH - 1);
    const max = 10 ** OTP_LENGTH - 1;
    const n = crypto.randomInt(min, max + 1);
    return String(n);
}