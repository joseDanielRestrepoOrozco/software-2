import express from 'express'
import connectDB from './database/connectDB.js'
import router from './routes/routes.js'
import unknownEndpoint from './middlewares/unknownEndpoint.js'

const app = express()

await connectDB()

app.use(express.json())
app.use('/api/v1', router)

app.use(unknownEndpoint)

export default app
