import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
// const authUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//
//     const user = await User.findOne({ email });
//
//     console.log("USER ID: " + JSON.stringify(user._id));
//
//     if (user && !user.isDisabled && (await user.matchPassword(password))) {
//         user.isLogout = false;
//
//         const updatedUser = await user.save();
//
//         res.json({
//             _id: updatedUser._id,
//             name: updatedUser.name,
//             email: updatedUser.email,
//             isAdmin: updatedUser.isAdmin,
//             isEditor: updatedUser.isEditor,
//             isDisabled: updatedUser.isDisabled,
//             isLogout: updatedUser.isLogout,
//             token: await generateToken(updatedUser._id),
//         });
//     } else if (
//         user &&
//         user.isDisabled &&
//         (await user.matchPassword(password))
//     ) {
//         res.status(401);
//         throw new Error("Your account is disabled!");
//     } else {
//         res.status(401);
//         throw new Error("Invalid email or password");
//     }
// });

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUserCookie = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log("USER ID: " + JSON.stringify(user._id));

    console.log("CONTROLLER EMAIL: " + email);
    console.log("CONTROLLER PASS: " + password);

    if (user && !user.isDisabled && (await user.matchPassword(password))) {
        user.isLogout = false;

        const updatedUser = await user.save();

        const token = await generateToken(updatedUser._id);

        console.log("CONTROLLER TOKEN: " + token);

        // Read more at https://expressjs.com/en/api.html #res.cookie
        // Note If both expires and maxAge are set in the options, then the last one defined in the object is what is used.
        // Note The expires option should not be set directly; instead only use the maxAge option.
        res.cookie("access_token", token, {
            // expires: new Date(Date.now() + expiration), // time until expiration, use maxAge instead
            // maxAge: 365 * 24 * 60 * 60 * 100, // expires or maxAge, pick only ONE
            // maxAge: process.env.COOKIE_EXPIRATION_TIME,
            secure: false, // set to true if you're using https
            httpOnly: true,
            sameSite: "strict", // Prevent cookies to be sent on a cross-site request
        });

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            isEditor: updatedUser.isEditor,
            isDisabled: updatedUser.isDisabled,
            isLogout: updatedUser.isLogout,
            // token: await generateToken(updatedUser._id),
        });
    } else if (
        user &&
        user.isDisabled &&
        (await user.matchPassword(password))
    ) {
        res.status(401);
        throw new Error("Your account is disabled!");
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isEditor: user.isEditor,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user && !user.isLogout) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isEditor: user.isEditor,
            isDisabled: user.isDisabled,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            isEditor: updatedUser.isEditor,
            isDisabled: updatedUser.isDisabled,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;
        user.isEditor = req.body.isEditor;
        user.isDisabled = req.body.isDisabled;
        user.disabledAt = req.body.disabledAt;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            isEditor: updatedUser.isEditor,
            isDisabled: updatedUser.isDisabled,
            disabledAt: updatedUser.disabledAt,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Disable user
// @route   PUT /api/users/:id/disable
// @access  Private/Admin
const disableUser = asyncHandler(async (req, res) => {
    const { isDisabled, disabledAt } = req.body;

    const user = await User.findById(req.params.id);

    process.env.TZ = "Asia/Ho_Chi_Minh";

    if (user) {
        user.isDisabled = isDisabled;
        user.disabledAt = disabledAt;
        user.updatedAt = Date.now();

        const updatedUser = await user.save();

        // await user.remove();
        // res.json({ message: "User disabled." });

        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error("User not found!");
    }
});

// TODO: Read this https://blog.logrocket.com/jwt-authentication-best-practices/#how-to-expire-a-single-token
// TODO: Use HTTPOnly flag to store JWT
// TODO: Use Secure flag for JWT when run over HTTPS
// TODO: Store JWT in localStorage but set low exp time(10') and use websocket to check user still connect and logged in and refresh token
// TODO: React redux toolkit websocket Context-based: https://www.pluralsight.com/guides/using-web-sockets-in-your-reactredux-app
// TODO: Check if browser close or tab close to dispatch logout
// @desc    Logout user
// @route   PUT /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    const { id, isLogout, logoutAt } = req.body;

    console.log("ID: " + JSON.stringify(id));

    const user = await User.findById(id);

    console.log("USER ID: " + JSON.stringify(user._id));
    console.log("USER REQ ID: " + JSON.stringify(id));

    if (user && !user.isDisabled && !user.isLogout) {
        user.isLogout = isLogout;
        user.logoutAt = logoutAt;

        const updatedUser = await user.save();

        // clear cookie token
        res.status(200).clearCookie("access_token");
        // res.status(200).localStorage.clear();

        // localStorage.removeItem("userInfo");
        // localStorage.clear();
        // res.status(200).localStorage.removeItem("userInfo");
        // localStorage.removeItem("cartItems");
        // localStorage.removeItem("shippingAddress");
        // localStorage.removeItem("paymentMethod");

        // req.session.destroy(function (err) {
        //     // res.redirect("/");
        //     console.log("LOGGED OUT");
        // });

        res.status(200).json({
            _id: updatedUser._id,
            isLogout: updatedUser.isLogout,
            logoutAt: updatedUser.logoutAt,
        });
    } else if (user && user.isDisabled) {
        res.status(401);
        throw new Error("Your account is disabled!");
    } else if (user && user.isLogout) {
        res.status(401);
        throw new Error("Your account is already logout!");
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

export {
    // authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    disableUser,
    logoutUser,
    authUserCookie,
};
