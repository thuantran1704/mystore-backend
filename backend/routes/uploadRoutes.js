import express from 'express'
const router = express.Router()

import { protect, admin } from '../middleware/authMiddleware.js'
import {
    UploadImages,
    DeleteImages,
} from '../controllers/uploadController.js'

//Upload image only ADMIN can use
router.route('/upload').post(UploadImages)
//Delete image only ADMIN can use
router.route('/destroy').delete(DeleteImages)


export default router