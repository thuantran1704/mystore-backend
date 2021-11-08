import express from 'express'
const router = express.Router()
import {
    deleteBrand,
    updateBrand,
    createBrand,
    getBrands,
    getDetailBrand
} from '../controllers/brandController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getBrands)
    .post(protect, createBrand)

router.route('/:id')
    .get(getDetailBrand)
    .delete(protect, deleteBrand)
    .put(protect, updateBrand)

export default router