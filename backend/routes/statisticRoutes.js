import express from 'express'
const router = express.Router()
import {
    statisticProductSold,
    statisticProfitBetween,
    statisticOrderBetween
} from '../controllers/statisticController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/')
    .get(protect, statisticProductSold)

router.route('/orderbetween')
    .post(protect, statisticOrderBetween)

router.route('/profitbetween')
    .post(statisticProfitBetween)


export default router