import prisma from '@repo/db';
import { Request, Response } from 'express';
import { asyncHandler, ApiError, ApiResponse } from '@repo/utils';
import { signinSchema, signupSchema,  VerifyOTPSignupSchema } from '@repo/validations';
import { sendOTP, verifyOTPService } from '../services/email.service';

export const handleInitSignup = asyncHandler(async (req: Request, res: Response) => {

    const { data, success, error } = signupSchema.safeParse(req.body)

    if (!success) {
        throw new ApiError(
            400,
            'Invalid User Input Schema',
            error.issues
        );
    }

    const { username, email } = data

    const isExist = await prisma.users.findUnique({
        where: {
            email: email,
            username: username
        }
    })

    if (isExist) {
        throw new ApiError(
            409,
            'User already exist'
        );
    }

    await sendOTP(email)

    res
        .status(200)
        .json(new ApiResponse(200, 'OTP send successfully'));
})

export const handleInitSignin = asyncHandler(async (req: Request, res: Response) => {
    const { success, data, error } = signinSchema.safeParse(req.body)

    if (!success) {
        throw new ApiError(
            400,
            "Invalid input",
            error.issues
        )
    }

    const { email } = data

    const isExist = await prisma.users.findUnique({
        where: {
            email: email,
        }
    })

    if (isExist) {
        throw new ApiError(
            409,
            'User already exist'
        );
    }

    await sendOTP(email)

    res
        .status(200)
        .json(new ApiResponse(200, 'OTP send successfully'));

})


export const handleSignup = asyncHandler(async (req: Request, res: Response) => {
    const { success, data, error } = VerifyOTPSignupSchema.safeParse(req.body)

    if (!success) {
        throw new ApiError(
            400,
            "Invalid input",
            error.issues
        )
    }

    const {username ,  email , otp } = data

    const isOtpValid = verifyOTPService(email , otp)

    

})

export const handleSignin = asyncHandler(async (req: Request, res: Response) => {
    const { success, data, error } = VerifyOTPSchema.safeParse(req.body)

    if (!success) {
        throw new ApiError(
            400,
            "Invalid input",
            error.issues
        )
    }

    const { email } = data

    const isExist = await prisma.users.findUnique({
        where: {
            email: email,
        }
    })

    if (isExist) {
        throw new ApiError(
            409,
            'User already exist'
        );
    }
})