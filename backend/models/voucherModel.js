import mongoose from 'mongoose'


const voucherSchema = mongoose.Schema(
    {
        name : { type: String, required: true },
        discount: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

const Voucher = mongoose.model('Voucher', voucherSchema)

export default Voucher