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
        taxPrice, shippingPrice, discountPrice,
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
            discountPrice,
            totalPrice,
        })
        order.orderItems.forEach(async item => {
            await updateStock(item.product, item.qty)
        })

        const createdOrder = await order.save()
        res.status(201).json(createdOrder._id)
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
        .populate('user', 'name email phone').populate('orderItems.product', 'name images')

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
        order.paidAt = Date.now()
        order.status = "Paid"

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
        .populate('user', 'name email phone').populate('orderItems.product', 'name images')
    res.json(orders)
})

// @desc        Get all orders
// @route       GET /api/orders
// @access      Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    // const pageSize = 8
    // const page = Number(req.query.pageNumber) || 1

    // const count = await Order.countDocuments()
    const orders = await Order.find({}).sort('-createdAt').populate('user', 'name email phone').populate('orderItems.product', 'name images')
    // .limit(pageSize)
    // .skip(pageSize * (page - 1))
    // res.json({ orders, page, pages: Math.ceil(count / pageSize), count})
    res.json(orders)
})

// @desc        Get all orders by status
// @route       GET /api/orders/status
// @access      Private/Admin
const getOrdersByStatus = asyncHandler(async (req, res) => {
    const orders = await Order.find({ "status": req.params.status }).sort('-createdAt')
        .populate('user', 'name email phone').populate('orderItems.product', 'name images')
    res.json(orders)
})

// @desc        Update order to delivered
// @route       GET /api/order/:id/deliver
// @access      Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone').populate('orderItems.product', 'name images')

    if (order) {
        order.deliveredAt = Date.now()
        order.status = "Delivered"

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

// @desc        Update order to received
// @route       GET /api/order/:id/deliver
// @access      Private/Admin
const updateOrderToReceived = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email phone').populate('orderItems.product', 'name images')

    if (order) {
        order.status = "Received"

        const updateOrder = await order.save()
        res.json(updateOrder)

    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc        Update order to cancelled
// @route       GET /api/orders/:id/cancel
// @access      Private/User
const updateOrderToCancelled = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email phone').populate('orderItems.product', 'name images')

    if (order) {
        if (order.status == "Delivered") {
            res.status(404)
            throw new Error('Order was Delivered ! Could not Cancel ')
        }
        order.deliveredAt = Date.now()
        order.status = 0

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
    updateOrderToCancelled,
    updateOrderToReceived,
    getOrdersByStatus
}
