import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'

// @desc        Fetch all category
// @route       GET /api/categorys
// @access      Public
const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.find().sort('createdAt')
    res.json(category)
})

// @desc        Fetch brand by ID
// @route       GET /api/brands
// @access      Public
const getDetailCategory = asyncHandler(async (req, res) => {
    const cate = await Category.findById(req.params.id)
    if (cate) {
        res.json(cate)
    } else {
        res.status(404)
        throw new Error('Category not found ')
    }
})

// @desc        Create a new category
// @route       POST /api/categories
// @access      Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const category = await Category.create({
        name, description
    })
    res.status(201).json(category)
})

// @desc        Delete category
// @route       DELETE /api/categories/:id
// @access      Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (category) {
        await category.remove()
        res.json({ message: 'Category removed' })
    }
    else {
        res.status(404)
        throw new Error('Category not found')
    }
})

// @desc        Update category 
// @route       PUT /api/categorys/:id
// @access      Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id)

    if (category) {
        category.name = req.body.name || category.name
        category.description = req.body.description || category.description

        const updatedCategory = await category.save()
        res.json({
            _id: updatedCategory._id,
            name: updatedCategory.name,
            description: updatedCategory.description,

        })
    } else {
        res.status(404)
        throw new Error('Category not found ')
    }
})


export {
    deleteCategory,
    updateCategory,
    createCategory,
    getCategory,
    getDetailCategory
}