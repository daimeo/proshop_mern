import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log("USER ID: " + JSON.stringify(user._id));

    if (user && !user.isDisabled && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isEditor: user.isEditor,
            isDisabled: user.isDisabled,
            token: await generateToken(user._id),
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

    if (user) {
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

// @desc    Logout user
// @route   PUT /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    console.log("ID: " + JSON.stringify(id));

    const user = await User.findById(id);

    console.log("USER ID: " + JSON.stringify(user._id));

    if (user && !user.isDisabled) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isEditor: user.isEditor,
            isDisabled: user.isDisabled,
            token: await generateToken(user._id, 5),
        });
    } else if (user && user.isDisabled) {
        res.status(401);
        throw new Error("Your account is disabled!");
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    disableUser,
    logoutUser,
};
