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
                qty: { type: Number, required: true },
                importPrice: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
            },
        ],
        voucher: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Voucher',
            },
        ],
        coin: {
            type: Number,
            default: 0.0,            
        },
        userAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Role',
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