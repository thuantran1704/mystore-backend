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
    .post(protect, createCategory)

router.route('/:id')
    .get(getDetailCategory)
    .delete(protect, deleteCategory)
    .put(protect, updateCategory)

export default router