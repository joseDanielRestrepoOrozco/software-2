import express from 'express'
import authController from '../controllers/auth.controller.js'
const router = express.Router()
import validateSchema from '../libs/validateSchema.js'
import { signupSchema } from '../schemas/auth.schema.js'

router.post('/sign-up', validateSchema(signupSchema), authController.signup)
router.post('/log-in', authController.login)

export default router
