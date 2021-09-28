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
    .post(protect, admin, createBrand)

router.route('/:id')
    .get(protect, admin, getDetailBrand)
    .delete(protect, admin, deleteBrand)
    .put(protect, admin, updateBrand)

export default router