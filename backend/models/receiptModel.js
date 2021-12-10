import mongoose from 'mongoose'

const receiptSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        receiptItems: [
            {
               
                qty: { type: Number, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },

            },
        ],
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Suplier',
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        orderAt: {
            type: Date,
        },
        receiveAt: {
            type: Date,
        },
        status: {
            type: String,
            default: "Ordered",
        },
    },
    {
        timestamps: true,
    }
)

const Receipt = mongoose.model('Receipt', receiptSchema)

export default Receipt