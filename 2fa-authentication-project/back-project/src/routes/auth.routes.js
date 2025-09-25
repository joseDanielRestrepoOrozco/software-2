import express from 'express'
import authController from '../controllers/auth.controller.js'
const router = express.Router()
import validateSchema from '../middlewares/validateSchema.js'
import { signupSchema } from '../schemas/auth.schema.js'

router.post('/sign-up', validateSchema(signupSchema), authController.signup)
router.post('/log-in', authController.login)
router.post('/verify-email', authController.verifyEmail)
router.post('/resend-verification-code', authController.resendVerificationCode)

export default router
