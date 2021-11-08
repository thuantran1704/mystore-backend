import express from 'express'
const router = express.Router()
import {
    statisticProductSold,
    statisticProductBetween,
    statisticOrderBetween
} from '../controllers/statisticController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/')
    .get(protect, statisticProductSold)

router.route('/orderbetween')
    .post(protect, statisticOrderBetween)

router.route('/productbetween')
    .post(statisticProductBetween)


export default router