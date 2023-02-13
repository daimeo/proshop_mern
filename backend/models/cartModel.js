import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        addressType: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        ward: { type: String, required: true },
        address: { type: String, required: true },
        postalCode: { type: String, required: false },
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
