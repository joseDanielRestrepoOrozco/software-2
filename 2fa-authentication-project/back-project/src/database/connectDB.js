import mongoose from 'mongoose'
import { DATABASE_URL } from '../libs/config.js'

const connectDB = async () => {
  console.log('connecting to database...')

  try {
    mongoose.set('strictQuery', false)

    const conn = await mongoose.connect(DATABASE_URL)
    console.log(`Database connected: ${conn.connection.name}`)
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}

export default connectDB
