import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app= express()
app.use(cors({
    origin:["https://gro-kart.vercel.app", "http://localhost:5173/"],
    credentials:true
}))

app.use(express.json({limit:"32kb"}))
app.use(express.urlencoded({extended:true,limit:"32kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRoute from './routes/user.routes.js'
app.use("/api/v1/users",userRoute);

import productRoute from './routes/product.routes.js'
app.use("/api/v1/products",productRoute);

import cartRoute from './routes/cart.routes.js'
app.use("/api/v1/cart",cartRoute);

import orderRoute from './routes/order.routes.js'
app.use("/api/v1/order",orderRoute);

import adminRoute from './routes/admin.routes.js'
app.use("/api/v1/admin",adminRoute);

import deliveryPartnerRoute from './routes/deliveryPartner.routes.js'
app.use("/api/v1/delivery",deliveryPartnerRoute);

import offerRoute from './routes/offer.routes.js'
app.use("/api/v1/offer",offerRoute);

import categoryRoute from './routes/category.routes.js'
app.use("/api/v1/category",categoryRoute);



export {app}