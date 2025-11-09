import prisma from '@repo/db';
import { sendOTP, verifyOTPService } from '../services/email.service'
import { Request, Response } from 'express';
import { createSession } from '../services/session.service';

export async function signupController(req: Request, res: Response) {
    const { email, username } = req.body;
    try {

        const existing = await prisma.users.findUnique({ where: { email } });
        if (existing) throw new Error('User already exists');

        const user = await prisma.users.create({ data: { email, username: username } });

        await sendOTP(email);
        res.json({ success: true, message: 'OTP sent to your email' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}


export async function signinController(req, res) {
    const { email } = req.body;
    try {
        const user = prisma.users.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        await sendOTP(email);
        res.json({ success: true, message: 'OTP sent' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}


export async function verifyController(req, res) {
    const { email, otp } = req.body;
    try {
        await verifyOTPService(email, otp);

        const user = await prisma.users.upsert({
            where: { email },
            update: {},
            create: { email },
        });

        const { accessToken, refreshToken } = await createSession(user.id, req.ip, req.get('user-agent'));

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.json({ success: true, accessToken, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}
