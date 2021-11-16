import express from 'express'
const router = express.Router()
import {
    addReceiptItems,
    getReceipts,
    updateReceiptToReceived,
    updateReceiptToCancelled,
    getReceiptById,
    getReceiptsByStatus
} from '../controllers/receiptController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/')
    .post(protect, addReceiptItems)
    .get(protect, getReceipts)

router.route('/:id')
    .get(protect, getReceiptById)
router.route('/status/:status')
    .get(protect, getReceiptsByStatus)

router.route('/:id/cancel').put(protect, updateReceiptToCancelled)
router.route('/:id/receive').put(protect, updateReceiptToReceived)


export default router