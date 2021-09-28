import asyncHandler from 'express-async-handler'
import Brand from '../models/brandModel.js'


// @desc        Fetch all brands
// @route       GET /api/brands
// @access      Public
const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find().sort('-createdAt')
    res.json(brands)
})

// @desc        Fetch brand by ID
// @route       GET /api/brands
// @access      Public
const getDetailBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id)
    if (brand) {
        res.json(brand)
    } else {
        res.status(404)
        throw new Error('Brand not found ')
    }
})

// @desc        Create a new brand
// @route       POST /api/brands
// @access      Private/Admin
const createBrand = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const brand = await Brand.create({
        name, description
    })
    res.status(201).json(brand)
})

// @desc        Delete brand
// @route       DELETE /api/brands/:id
// @access      Private/Admin
const deleteBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id)
    if (brand) {
        await brand.remove()
        res.json({ message: 'Brand removed' })
    }
    else {
        res.status(404)
        throw new Error('Brand not found')
    }
})

// @desc        Update brand 
// @route       PUT /api/brands/:id
// @access      Private/Admin
const updateBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id)

    if (brand) {
        brand.name = req.body.name || brand.name
        brand.description = req.body.description || brand.description

        const updatedBrand = await brand.save()
        res.json({
            _id: updatedBrand._id,
            name: updatedBrand.name,
            description: updatedBrand.description,

        })
    } else {
        res.status(404)
        throw new Error('Brand not found ')
    }
})


export {
    deleteBrand,
    updateBrand,
    createBrand,
    getBrands,
    getDetailBrand
}