import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const signup = async (req, res) => {
  let { email, currentPassword, fullname } = req.body

  let userExist = await prisma.users.findUnique({
    where: { email },
  })

  if (userExist) {
    console.log('User already exists')
    return res.status(400).json({ error: 'User already exists' })
  }

  const createUser = await prisma.users.create({
    data: {
      email,
      current_password: await bcrypt.hash(currentPassword, 10),
      fullname,
    },
  })

  res.status(201).json(createUser)
}

const login = async (req, res) => {
  const { email, currentPassword } = req.body
  console.log({ email, currentPassword })
  res.send({ email, currentPassword })
}

export default { signup, login }
