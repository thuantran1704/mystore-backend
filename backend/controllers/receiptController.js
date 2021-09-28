import asyncHandler from 'express-async-handler'
import Receipt from '../models/receiptModel.js'
import Product from '../models/productModel.js'


// @desc        Create new Receipt
// @route       POST /api/receipts
// @access      Private/ Admin
const addReceiptItems = asyncHandler(async (req, res) => {
    const {
        receiptItems,
        supplier,
        itemsPrice,
        shippingPrice,
        totalPrice
    } = req.body

    if (receiptItems && receiptItems.length == 0) {
        res.status(400)
        throw new Error('No receipt item')
    } else {
        const receipt = new Receipt({
            receiptItems,
            user: req.user._id,
            supplier,
            itemsPrice,
            shippingPrice,
            totalPrice,
            orderAt : Date.now(),
        })

        const createdreceipt = await receipt.save()
        res.status(201).json(createdreceipt)
    }
})

// @desc        Get receipt by ID
// @route       GET /api/receipts/:id
// @access      Private/Admin
const getReceiptById = asyncHandler(async (req, res) => {
    const receipt = await Receipt.findById(req.params.id)

    if (receipt) {
        res.json(receipt)
    } else {
        res.status(404)
        throw new Error('Receipt not found')
    }
})

// @desc        Get all receipts
// @route       GET /api/receipts
// @access      Private/Admin
const getReceipts = asyncHandler(async (req, res) => {
    const pageSize = 8
    const page = Number(req.query.pageNumber) || 1

    const count = await Receipt.countDocuments()
    const receipts = await Receipt.find({}).sort('-createdAt')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
    res.json({ receipts, page, pages: Math.ceil(count / pageSize), count })
})

// @desc        Update receipt to delivered
// @route       PUT /api/receipts/:id/receive
// @access      Private/Admin
const updateReceiptToReceived = asyncHandler(async (req, res) => {
    const receipt = await Receipt.findById(req.params.id)

    if (receipt) {
        receipt.status = "Received"
        receipt.receiveAt = Date.now()

        receipt.receiptItems.forEach(async item => {
            await updateStock(item.product, item.qty)
        })

        const updateReceipt = await receipt.save()
        res.json(updateReceipt)

    } else {
        res.status(404)
        throw new Error('Receipt not found')
    }
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id)
    product.countInStock = product.countInStock + quantity
    await product.save({ validateBeforeSave: false })
}

// @desc        Update receipt to cancelled
// @route       GET /api/receipts/:id/cancel
// @access      Private/User
const updateReceiptToCancelled = asyncHandler(async (req, res) => {
    const receipt = await Receipt.findById(req.params.id)

    if (receipt) {
        if (receipt.status === "Received") {
            res.status(404)
            throw new Error('Receipt is Received ! Can not Cancel ')
        }
        receipt.status = "Cancelled"
        receipt.receiveAt = Date.now()

        const updateReceipt = await receipt.save()
        res.json(updateReceipt)

    } else {
        res.status(404)
        throw new Error('Receipt not found')
    }
})


export {
    addReceiptItems,
    getReceipts,
    updateReceiptToReceived,
    updateReceiptToCancelled,
    getReceiptById
}
