import express from 'express'
const router = express.Router()
import {
    getInfoDashboard,
} from '../controllers/dashboardController.js'

router.route('/').get(getInfoDashboard)

export default router