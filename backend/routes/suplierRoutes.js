import express from 'express'
const router = express.Router()
import {
    RegisterSuplier,
    getSupliers,

} from '../controllers/suplierController.js'

router.route('/')
    .post(RegisterSuplier)
    .get(getSupliers)




export default router