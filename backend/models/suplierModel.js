import mongoose from 'mongoose'

const suplierSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true,
            unique: true
        },
        country: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
        },
    }, {
    timestamps: true
}
)

const Suplier = mongoose.model('Suplier', suplierSchema)

export default Suplier