import { z } from 'zod';

export const SendOTPSchema = z.object({
    email: z.email('Invalid email format')
        .toLowerCase()
        .trim()
        .max(255, 'Email too long'),
});

export const VerifyOTPSchema = z.object({
    email: z.email('Invalid email format')
        .toLowerCase()
        .trim()
        .max(255, 'Email too long'),
    otp: z.string()
        .length(6, 'OTP must be 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only digits'),
});

export const RefreshTokenSchema = z.object({
    refreshToken: z.string().optional(),
});