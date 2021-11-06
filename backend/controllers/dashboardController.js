import asyncHandler from 'express-async-handler'

import Order from '../models/orderModel.js'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import Receipt from '../models/receiptModel.js'

// @desc        Get info for Dashboard
// @route       GET /api/dashboard
// @access      Private/Admin
const getInfoDashboard = asyncHandler(async (req, res) => {
    const productCount = await Product.countDocuments()
    const userCount = await User.countDocuments()
    const orderCount = await Order.countDocuments()
    const receiptCount = await Receipt.countDocuments()
    const product = {
        name : "Product",
        count : productCount
    }
    const user = {
        name : "User",
        count : userCount
    }
    const order = {
        name : "Order",
        count : orderCount
    }
    const receipt = {
        name : "Receipt",
        count : receiptCount
    }
  
    res.json({ product,user,order,receipt })
})

export {
    getInfoDashboard
}