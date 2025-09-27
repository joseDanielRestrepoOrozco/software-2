import express from 'express'
import authController from '../controllers/auth.controller.js'
const router = express.Router()
import validateSchema from '../middlewares/validateSchema.js'
import {
  loginSchema,
  resendVerificationCodeSchema,
  signupSchema,
  verifyEmailSchema,
} from '../schemas/auth.schema.js'

router.post('/sign-up', validateSchema(signupSchema), authController.signup)
router.post('/log-in', validateSchema(loginSchema), authController.login)
router.post(
  '/verify-email',
  validateSchema(verifyEmailSchema),
  authController.verifyEmail
)
router.post(
  '/resend-verification-code',
  validateSchema(resendVerificationCodeSchema),
  authController.resendVerificationCode
)

export default router
