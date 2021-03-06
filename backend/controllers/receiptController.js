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
            shippingPrice,
            totalPrice,
            orderAt: Date.now(),
        })

        const createdreceipt = await receipt.save()
        res.status(201).json(createdreceipt._id)
    }
})

// @desc        Get all receipts by status
// @route       GET /api/receipts/status/:status
// @access      Private/Admin
const getReceiptsByStatus = asyncHandler(async (req, res) => {
    const receipts = await Receipt.find({ "status": req.params.status }).sort('-createdAt').populate('user', 'name email')
    .populate('receiptItems.product', 'name images')
    .populate('supplier', 'name address country phone')
    res.json(receipts)
})

// @desc        Get receipt by ID
// @route       GET /api/receipts/:id
// @access      Private/Admin
const getReceiptById = asyncHandler(async (req, res) => {
    const receipt = await Receipt.findById(req.params.id).populate('user', 'name email')
    .populate('receiptItems.product', 'name images')
    .populate('supplier', 'name address country phone')
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
    // const pageSize = 8
    // const page = Number(req.query.pageNumber) || 1

    // const count = await Receipt.countDocuments()
    const receipts = await Receipt.find({}).sort('-createdAt').populate('user', 'name email')
    .populate('receiptItems.product', 'name images')
    .populate('supplier', 'name address country phone')
    // .limit(pageSize)
    // .skip(pageSize * (page - 1))
    res.json(receipts)
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
    getReceiptById,
    getReceiptsByStatus
}
