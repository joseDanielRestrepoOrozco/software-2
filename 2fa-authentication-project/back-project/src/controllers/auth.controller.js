import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import emailConfig from '../config/emailConfig.js'

const signup = async (req, res) => {
  let { email, currentPassword, fullname } = req.body

  let userExist = await prisma.users.findUnique({
    where: { email },
  })

  if (userExist) {
    console.log('User already exists')
    return res.status(400).json({ error: 'User already exists' })
  }

  const verificationCode = emailConfig.generateVerificationCode()

  const verificationExpires = new Date()
  verificationExpires.setMinutes(verificationExpires.getMinutes() + 15)

  const createUser = await prisma.users.create({
    data: {
      email,
      currentPassword: await bcrypt.hash(currentPassword, 10),
      fullname,
      verificationCode,
      verificationCodeExpires: verificationExpires,
    },
  })

  const emailResult = await emailConfig.sendVerificationEmail(
    email,
    fullname,
    verificationCode
  )

  if (!emailResult.success) {
    await prisma.users.delete({
      where: { id: createUser.id },
    })
    return res.status(500).json({ message: 'Error sending verification email' })
  }

  res.status(201).json(createUser)
}

const login = async (req, res) => {
  const { email, currentPassword } = req.body
  const user = await prisma.users.findUnique({
    where: { email },
  })

  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' })
  }

  if (user.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'Account not verified' })
  }

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.currentPassword
  )

  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '3h' }
  )

  res.send({ token })
}

const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (user.status === 'ACTIVE') {
      return res.status(400).json({ error: 'La cuenta ya ha sido verificada' })
    }

    if (new Date() > user.verificationCodeExpires) {
      return res
        .status(400)
        .json({ error: 'El código de verificación ha expirado' })
    }

    if (user.verificationCode !== verificationCode) {
      return res
        .status(400)
        .json({ error: 'Código de verificación incorrecto' })
    }

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        status: 'ACTIVE',
        verificationCode: null,
        verificationCodeExpires: null,
      },
    })

    return res.status(200).json({
      message: 'Cuenta verificada con éxito',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullname: updatedUser.fullname,
        status: updatedUser.status,
      },
    })
  } catch (_error) {
    return res.status(500).json({ error: 'Error del servidor' })
  }
}

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.users.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (user.status === 'ACTIVE') {
      return res.status(400).json({ error: 'La cuenta ya ha sido verificada' })
    }

    const verificationCode = emailConfig.generateVerificationCode()
    const verificationExpires = new Date()
    verificationExpires.setMinutes(verificationExpires.getMinutes() + 15)

    await prisma.users.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationCodeExpires: verificationExpires,
      },
    })

    const emailResult = await emailConfig.sendVerificationEmail(
      user.email,
      user.fullname,
      verificationCode
    )

    if (!emailResult.success) {
      return res
        .status(500)
        .json({ error: 'Error enviando el código de verificación' })
    }

    return res.status(200).json({
      message: 'Nuevo código de verificación enviado',
    })
  } catch (error) {
    console.error('Error en resendVerificationCode:', error)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}

export default { signup, login, verifyEmail, resendVerificationCode }
