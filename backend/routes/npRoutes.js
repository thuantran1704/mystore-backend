import express from 'express'
const router = express.Router()
import {
    iLoveU,
} from '../controllers/npController.js'

router.route('/').get(iLoveU)

export default router