import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'


// @desc        Create new order
// @route       POST /api/order
// @access      Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems, shippingAddress,
        paymentMethod, itemsPrice,
        taxPrice, shippingPrice,
        totalPrice } = req.body

    if (orderItems && orderItems.length == 0) {
        res.status(400)
        throw new Error('No order item')
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })
        order.orderItems.forEach(async item => {
            await updateStock(item.product, item.qty)
        })
        
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id)
    product.countInStock = product.countInStock - quantity
    
    await product.save({ validateBeforeSave: false })
}

// @desc        Get order by ID
// @route       GET /api/order/:id
// @access      Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')

    if (order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc        Update order to paid
// @route       GET /api/order/:id/pay
// @access      Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updateOrder = await order.save()
        res.json(updateOrder)

    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc        Get logged in user orders
// @route       GET /api/orders/myorders
// @access      Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt')
    res.json(orders)
})

// @desc        Get all orders
// @route       GET /api/orders
// @access      Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const pageSize = 8
    const page = Number(req.query.pageNumber) || 1

    const count = await Order.countDocuments()
    const orders = await Order.find({}).sort('-createdAt').populate('user', 'id name')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
    res.json({ orders, page, pages: Math.ceil(count / pageSize), count})
})

// @desc        Update order to delivered
// @route       GET /api/order/:id/deliver
// @access      Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        order.orderItems.forEach(async item => {
            await updateSold(item.product, item.qty)
        })

        const updateOrder = await order.save()
        res.json(updateOrder)

    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

async function updateSold(id, quantity) {
    const product = await Product.findById(id)
    product.sold = product.sold + quantity
    await product.save({ validateBeforeSave: false })
}

// @desc        Update order to cancelled
// @route       GET /api/order/:id/cancel
// @access      Private/User
const updateOrderToCancelled = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        if(order.isDelivered == true){
            res.status(404)
            throw new Error('Order is Delivered ! Can not Cancel ')
        }
        order.isPaid = false
        order.deliveredAt = Date.now()
        order.isCancelled = true

        order.orderItems.forEach(async item => {
            await returnStock(item.product, item.qty)
        })

        const updateOrder = await order.save()
        res.json(updateOrder)

    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

async function returnStock(id, quantity) {
    const product = await Product.findById(id)
    product.countInStock = product.countInStock + quantity

    await product.save({ validateBeforeSave: false })
}


export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    updateOrderToCancelled
}
