import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app= express()
app.use(cors({
    origin:["https://gro-kart.vercel.app", 
      "http://localhost:5174",
      "http://localhost:5173",
      "https://grokart-a-web-app-for-admin.vercel.app",
      "https://grokartapp.com",
      "https://www.grokartapp.com",
    ],
    credentials:true
}))

app.use(express.json({limit:"32kb"}))
app.use(express.urlencoded({extended:true,limit:"32kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  });
  

import userRoute from './routes/user.routes.js'
app.use("/api/v1/users",userRoute);

import productRoute from './routes/product.routes.js'
app.use("/api/v1/products",productRoute);

import cartRoute from './routes/cart.routes.js'
app.use("/api/v1/cart",cartRoute);

import orderRoute from './routes/order.routes.js'
app.use("/api/v1/order",orderRoute);

import paymentRoute from './routes/payment.routes.js'
app.use("/api/v1/payment",paymentRoute);

import adminRoute from './routes/admin.routes.js'
app.use("/api/v1/admin",adminRoute);

import deliveryPartnerRoute from './routes/deliveryPartner.routes.js'
app.use("/api/v1/delivery",deliveryPartnerRoute);

import offerRoute from './routes/offer.routes.js'
app.use("/api/v1/offer",offerRoute);

import categoryRoute from './routes/category.routes.js'
app.use("/api/v1/category",categoryRoute);

import shopRoute from './routes/shop.routes.js'
app.use("/api/v1/shop",shopRoute);

import areaRoute from './routes/area.routes.js'
app.use("/api/v1/area",areaRoute);

import aiAgentRoute from './routes/aiAgent.routes.js'
app.use("/api/v1/ai",aiAgentRoute);

import pushRoute from "./routes/push.routes.js"
app.use("/api/v1/push",pushRoute);

import wishListRoute from "./routes/wishList.routes.js"
app.use("/api/v1/wishList",wishListRoute);

import mobileBannerRoute from "./routes/mobileBanner.routes.js"
app.use("/api/v1/banner",mobileBannerRoute);

import noticeRoute from "./routes/notice.routes.js"
app.use("/api/v1/notice",noticeRoute);




export {app}