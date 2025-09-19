import { z } from 'zod/v4'

export const signupSchema = z.object({
  email: z.email(),
  currentPassword: z
    .string()
    .min(1)
    .max(6)
    .refine(val => /\d/.test(val), {
      error: 'Debe contener al menos un número',
    }),
  fullname: z.string().min(1),
})
