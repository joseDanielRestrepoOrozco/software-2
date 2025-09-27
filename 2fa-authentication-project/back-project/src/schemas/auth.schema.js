import { z } from 'zod/v4'

const currentPassword = z
  .string()
  .min(1)
  .max(6)
  .refine(val => /\d/.test(val), {
    error: 'Debe contener al menos un número',
  })

const email = z.email()

export const signupSchema = z.object({
  email,
  currentPassword,
  fullname: z.string().min(1),
})

export const loginSchema = z.object({
  email,
  currentPassword,
})

export const verifyEmailSchema = z.object({
  email,
  verificationCode: z.string().min(1).max(6),
})

export const resendVerificationCodeSchema = z.object({
  email,
})
