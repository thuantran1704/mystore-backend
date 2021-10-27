import asyncHandler from 'express-async-handler'

// @desc        Get all my love to Nhat Phung
// @route       GET /api/love
// @access      Public
const iLoveU = asyncHandler(async (req, res) => {
    const Thuận_Trần_said = "💙 I love you to the Moon and back ! 💙"
    res.json({Thuận_Trần_said}
        
    )
})
export { iLoveU }