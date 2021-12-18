import express from 'express'
const router = express.Router()
import {
    authUser,
    getUserProfile,
    RegisterUser,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    disableUser,
    addItemToUserCart,
    removeItemInUserCart,
    getUserCart,
    removeAllItemInUserCart,
    checkExistEmail,
    getUsersByIsDisable, 
    enableUser,
    addVoucherToUserVoucher,
    removeVoucherInUserVoucher,
    getUserVoucher,
    updateUserCoin
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(RegisterUser).get(getUsers)
router.route('/check').post(checkExistEmail)
router.post('/login', authUser)

router.post('/isdisable', getUsersByIsDisable)

router.put('/disable/:id', disableUser)
router.put('/enable/:id', enableUser)

//GET res
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)

router.route('/:id').delete(protect, deleteUser)
    .get(protect, getUserById)
    .put(protect, updateUser)

router.route('/cart/:id/add').post(protect, addItemToUserCart)
router.route('/cart/:id/remove').delete(protect, removeItemInUserCart)
router.route('/cart/remove').delete(protect, removeAllItemInUserCart)
router.route('/cart/mycart').get(protect, getUserCart)

router.route('/voucher/myvoucher').get(protect, getUserVoucher)

router.route('/voucher/add').post(protect, addVoucherToUserVoucher)
router.route('/voucher/:id/remove').delete(protect, removeVoucherInUserVoucher)

router.route('/coin').put(protect, updateUserCoin)


export default router