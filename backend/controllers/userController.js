import asyncHandler from 'express-async-handler'
import generateToken from '../utills/generateToken.js'
import User from '../models/userModel.js'
import Role from '../models/roleModel.js'
import Product from '../models/productModel.js'

// @desc        Auth user & get token
// @route       POST /api/users/login
// @access      Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (user && user.isDisable === true) {
        res.status(401)
        throw new Error('This user is Disable')
    }
    else if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            cart: user.cart,
            isDisable: user.isDisable,
            role: user.role,
            userAddress: user.userAddress,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    Add item to user cart
// @route   POST /api/users/cart/:id/add
// @access  Private
const addItemToUserCart = asyncHandler(async (req, res) => {
    const qty = req.body.qty
    console.log("qty : " + qty);
    const product = await Product.findById(req.params.id)

    if (product) {
        const alreadyAdded = req.user.cart.find(
            (item) => item.product._id.toString() === product._id.toString()
        )

        if (!alreadyAdded) {
            const item = {
                name: product.name,
                qty: qty,
                image: product.images[0].url,
                price: product.price,
                product: product._id,
            }
            req.user.cart.push(item)
            await req.user.save()
            res.status(201).json({ message: 'Add to cart Successfully' })
        }
        else {
            req.user.cart.map(
                (item) => {
                    if (item.product.toString() === alreadyAdded.product.toString() && product.countInStock >= (item.qty + qty)) {
                        item.qty += Number(qty)
                    }
                }
            )
            await req.user.save()
            res.status(201).json({ message: 'Update to cart Successfully' })
        }

    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    remove item in user cart
// @route   PUT /api/users/cart/:id/remove
// @access  Private
const removeItemInUserCart = asyncHandler(async (req, res) => {
    const producId = req.params.id

    if (req.user.cart.length <= 0) {
        res.status(404)
        throw new Error('Your cart is empty')
    }
    const alreadyAdded = req.user.cart.find(
        (item) => item.product._id.toString() === producId.toString()
    )
    if (alreadyAdded) {
        req.user.cart = req.user.cart.filter(
            (item) => item.product.toString() !== alreadyAdded.product.toString()
        )
        const cartRemoved = await req.user.save()
        res.json({ message: 'Product removed from cart', cartRemoved: cartRemoved })
    }
    else {
        res.json({ message: "Product not found" })
    }
}
)

// @desc    remove item in user cart
// @route   PUT /api/users/cart/:id/remove
// @access  Private
const removeAllItemInUserCart = asyncHandler(async (req, res) => {
    if (req.user.cart.length <= 0) {
        res.status(404)
        throw new Error('Your cart is empty')
    }
    req.user.cart = []

    await req.user.save()
    res.json({ message: 'Product removed from cart' }).status(200)
}
)

// @desc        Get user cart
// @route       GET /api/users/cart
// @access      Private
const getUserCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json(
            user.cart
        )
    } else {
        res.status(404)
        throw new Error('User not found ')
    }
})

// @desc        Get user profile
// @route       GET /api/users/profile
// @access      Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            userAddress: user.userAddress,
            role: user.role,
        })
    } else {
        res.status(404)
        throw new Error('User not found ')
    }
})

// @desc        Update user profile
// @route       PUT /api/users/profile
// @access      Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.phone = req.body.phone || user.phone

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            token: generateToken(updatedUser._id),
        })
    }
    else {
        res.status(404)
        throw new Error('User not found ')
    }
})

// @desc        Register a new user
// @route       POST /api/users
// @access      Public
const RegisterUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, userAddress, role } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const findRole = await Role.findById(role)
    const roleObj = { name: findRole.name, role: role }


    const user = await User.create({
        name,
        email,
        password,
        phone,
        userAddress,
        role: roleObj,
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            userAddress: user.userAddress,
            role: user.role.name,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc        check email to register a new user
// @route       POST /api/users/check
// @access      Public
const checkExistEmail = asyncHandler(async (req, res) => {
    const {email} = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    else {
        res.status(200)

    }
})

// @desc        Get all user
// @route       GET /api/users
// @access      Private/Admin
const getUsers = asyncHandler(async (req, res) => {

    const users = await User.find({}).sort('-createdAt')
    // const result = {
    //     data : users,
    // }
    // console.log("was called this api !");
    res.json(users)
})

// @desc        Delete user
// @route       DELETE /api/users/:id
// @access      Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        await user.remove()
        res.json({ message: 'User removed' })
    }
    else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc        DISABLE user
// @route       DISABLE /api/users/:id
// @access      Private/Admin
const disableUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        user.isDisable = true
        await user.save()

        res.json({ message: 'User disable' })
    }
    else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc        Get user by id
// @route       GET /api/users/:id
// @access      Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc        Update user 
// @route       PUT /api/users/:id
// @access      Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        const findRole = await Role.findById(req.body.role)
        const roleObj = findRole ? { name: findRole.name, role: findRole._id } : null

        user.role = roleObj || user.role

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
        })
    } else {
        res.status(404)
        throw new Error('User not found ')
    }
})

export {
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
    checkExistEmail
}