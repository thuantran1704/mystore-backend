import express from 'express'
const router = express.Router()
import {
    getVouchers, createVoucher, updateVoucher, deleteVoucher,
} from '../controllers/voucherController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getVouchers).post(protect, admin, createVoucher)
router.route('/:id').put(protect, admin, updateVoucher).delete(protect, admin, deleteVoucher)

export default router