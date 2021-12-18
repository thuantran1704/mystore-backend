import express from 'express'
const router = express.Router()
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    updateOrderToCancelled,
    updateOrderToReceived,
    getOrdersByStatus,
    updateOrderToReturned,
    updateOrderToReturn
    // updateOrderItemToReviewed
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(protect, addOrderItems)
    .get(protect, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/status/:status').get(protect, getOrdersByStatus)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/cancel').put(protect, updateOrderToCancelled)
router.route('/:id/receive').put(protect, updateOrderToReceived)

router.route('/:id/return').put(protect, updateOrderToReturn)
router.route('/:id/returned').put(protect, updateOrderToReturned)
router.route('/:id/deliver').put(protect, updateOrderToDelivered)


export default router