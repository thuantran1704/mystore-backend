import express from 'express'
const router = express.Router()
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
    createProductReview,
    getTopProducts,
    getProductsByBrand,
    getTopProductsByBrand,
    getSameProductsByBrand,
    getTopProductsByCategory,
    getProductsByCategory
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getProducts)
    .post(protect, admin, createProduct)

router.route('/brand/:brand').get(getProductsByBrand)
router.route('/top/:brand').get(getTopProductsByBrand)

router.route('/category/:category').get(getProductsByCategory)
router.route('/top4/:category').get(getTopProductsByCategory)

router.route('/same/:brand').get(getSameProductsByBrand)

router.route('/:id/reviews').post(protect, createProductReview)

router.route('/top').get(getTopProducts)

router.route('/:id').get(getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct)

export default router