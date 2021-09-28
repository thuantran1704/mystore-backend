import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import colors from 'colors'
import morgan from 'morgan'
import cloudinary from 'cloudinary'
import fileUpload from 'express-fileupload'
import { notFound, errorHandle } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import brandRoutes from './routes/brandRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import receiptRoutes from './routes/receiptRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import statisticRoutes from './routes/statisticRoutes.js'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())
app.use(fileUpload({
    useTempFiles: true
}))

// Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'))
// }

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/receipts', receiptRoutes)
app.use('/api/statistic', statisticRoutes)

app.use('/api', uploadRoutes)

app.get('api/config/paypal', (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID))

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
  } else {
    app.get('/', (req, res) => {
        res.send('hello my name is suzie : API is running')
    })
}


app.use(notFound)

app.use(errorHandle)

const PORT = process.env.PORT || 5000

app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))