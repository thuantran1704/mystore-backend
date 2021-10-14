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
    getUserCart
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(RegisterUser).get(getUsers)
router.post('/login', authUser)

router.put('/disable/:id', disableUser)

//GET res
router.route('/profile')
    .get(getUserProfile)
    .put(updateUserProfile)

router.route('/:id').delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)

router.route('/cart/:id/add').post(protect, addItemToUserCart)
router.route('/cart/:id/remove').delete(protect, removeItemInUserCart)
router.route('/cart/mycart').get(protect, getUserCart)


export default router