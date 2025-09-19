// convertir a ES module

import express from 'express'
import connectDB from './database/connectDB.js'
import router from './routes/routes.js'

const app = express()

connectDB()

app.use(express.json())
app.use('/api/v1', router)

export default app
