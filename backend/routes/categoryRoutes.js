import express from 'express'
const router = express.Router()
import {
    deleteCategory,
    updateCategory,
    createCategory,
    getCategory,
    getDetailCategory
} from '../controllers/categoryController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getCategory)
    .post(protect, admin, createCategory)

router.route('/:id')
    .get(protect, admin, getDetailCategory)
    .delete(protect, admin, deleteCategory)
    .put(protect, admin, updateCategory)

export default router