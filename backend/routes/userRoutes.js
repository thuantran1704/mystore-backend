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
    getUsersByIsDisable
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(RegisterUser).get(getUsers)
router.route('/check').post(checkExistEmail)
router.post('/login', authUser)
router.post('/isdisable', getUsersByIsDisable)

router.put('/disable/:id', disableUser)

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


export default router