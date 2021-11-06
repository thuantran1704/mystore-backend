import asyncHandler from 'express-async-handler'

import Order from '../models/orderModel.js'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import Receipt from '../models/receiptModel.js'

// @desc        Get info for Dashboard
// @route       GET /api/dashboard
// @access      Private/Admin
const getInfoDashboard = asyncHandler(async (req, res) => {
    const products = await Product.countDocuments()
    const users = await User.countDocuments()
    const orders = await Order.countDocuments()
    const receipts = await Receipt.countDocuments()
  
    res.json({ products,users,orders,receipts })
})

export {
    getInfoDashboard
}