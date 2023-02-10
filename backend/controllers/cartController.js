import asyncHandler from "express-async-handler";
import Address from "../models/addressModel.js";

// @desc Save shipping address
// @route POST /api/cart/address
// @access Private
const addShippingAddress = asyncHandler(async (req, res) => {
    const {
        userId,
        address,
        ward,
        district,
        city,
        postalCode,
        country,
        addressType,
    } = req.body;

    console.log(userId);

    //TODO: Fix HERE, CONTINUE HERE
    const user = await User.findById(userId);

    console.log("USER ADDRESS: " + JSON.stringify(user));

    if (user) {
        const shippingAddress = new Address({
            user: req.user._id,
            country,
            city,
            district,
            ward,
            address,
            postalCode,
            addressType,
        });

        const addAddress = await shippingAddress.save();

        res.status(200).json(addAddress);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc Get shipping address by user ID
// @route GET /api/cart/address
// @access Private
const getShippingAddress = asyncHandler(async (req, res) => {
    const { userId, addressType } = req.body;
    console.log("userId: " + userId);
    console.log("userId Type: " + typeof userId);

    // findOne() will return an object, find() will return an array of objects
    const address = await Address.findOne({
        user: req.user._id,
        addressType: addressType,
    }).populate("user", "id name email");

    // console.log("ADDRESS: " + address.user.id);
    // console.log(typeof address);

    if (userId === address.user._id.toString() && address) {
        res.status(200).json(address);
    } else {
        res.status(404);
        throw new Error("Address not found");
    }
});

export { addShippingAddress, getShippingAddress };
