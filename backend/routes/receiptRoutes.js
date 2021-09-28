import express from 'express'
const router = express.Router()
import {
    addReceiptItems,
    getReceipts,
    updateReceiptToReceived,
    updateReceiptToCancelled,
    getReceiptById
} from '../controllers/receiptController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/')
    .post(protect, admin, addReceiptItems)
    .get(protect, admin, getReceipts)

router.route('/:id')
    .get(protect, admin, getReceiptById)

router.route('/:id/cancel').put(protect, admin, updateReceiptToCancelled)
router.route('/:id/receive').put(protect, admin, updateReceiptToReceived)


export default router