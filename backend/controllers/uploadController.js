import asyncHandler from 'express-async-handler'
import cloudinary from 'cloudinary'
import fs from 'fs'

// Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// @desc        Upload Images to cloudinary
// @route       POST /api/upload
// @access      Private/Admin
const UploadImages = asyncHandler(async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ msg: "No files were uploaded!" })
        }
        const file = req.files.file
        if (file.size > 1024 * 1024 * 5) {
            removeTmp(file.tempFilePath)
            //If file.size > 5MB
            return res.status(400).json({ msg: "File too large!" })
        }
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "File format is incorrect!" })
        } 
        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "shop" }, async (err, result) => {
            if (err) throw err
            removeTmp(file.tempFilePath)
            res.json({ public_id: result.public_id, url: result.url })
        })
    } catch (error) {
        return res.status(500).json({ msg: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
})

// @desc        Delete Images in cloudinary
// @route       POST /api/upload
// @access      Private/Admin
const DeleteImages = asyncHandler(async (req, res) => {
    try {
        const { public_id } = req.body
        if (!public_id) {
            return res.status(400).json({ msg: "No image" })
        }

        cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
            if (err) throw err
            res.json({ msg: "Deleted image" })
        })


    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})
const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err

    })
}

export {
    UploadImages,
    DeleteImages,
 
}