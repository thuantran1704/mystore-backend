import Suplier from "../models/suplierModel.js"
import asyncHandler from 'express-async-handler'

// @desc        Get all Suplier
// @route       GET /api/supliers
// @access      Private/Admin
const getSupliers = asyncHandler(async (req, res) => {

    const Supliers = await Suplier.find({}).sort('-createdAt')

    res.json(Supliers)
})

// @desc        Register a new user
// @route       POST /api/users
// @access      Public
const RegisterSuplier = asyncHandler(async (req, res) => {
    const { name, address, country, phone } = req.body

    const suplierExists = await Suplier.findOne({ phone })

    if (suplierExists) {
        res.status(400)
        throw new Error('Suplier already exists')
    }

    const suplier = await Suplier.create({
        name,
        address,
        country,
        phone,
    })

    if (suplier) {
        res.status(201).json(suplier)
    } else {
        res.status(400)
        throw new Error('Invalid suplier data')
    }
})

export { getSupliers, RegisterSuplier, }
