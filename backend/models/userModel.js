import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        cart: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
            },
        ],
        voucher: [
            {
                name: { type: String, required: true },
                discount: { type: Number, required: true },
                voucherId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Voucher',
                },
            },
        ],
        userAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        role: {
            name: {
                type: String,
                required: true,
            },
            role: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Role',
            }
        },
        isDisable: {
            type: Boolean,
            default: false
        }
    }, {
    timestamps: true
}
)

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User