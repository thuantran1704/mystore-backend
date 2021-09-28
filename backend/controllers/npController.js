import asyncHandler from 'express-async-handler'

// @desc        Get all my love to Nhat Phung
// @route       GET /api/love
// @access      Public
const iLoveU = asyncHandler(async (req, res) => {
    const GiftForNhatPhung = "Anh thương Em nhiều nhắmmm áaa ! <3"
    res.json({
        GiftForNhatPhung
    })
})
export { iLoveU }