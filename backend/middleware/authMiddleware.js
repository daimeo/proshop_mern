import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
// import * as jose from "jose";

// const secretKey = new TextEncoder().encode(
//     "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2"
// );

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // console.log("TOKEN: " + token);

            const decoded = jwt.verify(token, process.env.JWT_SECRET, {
                algorithms: ["HS512"],
            });

            console.log("DECODED: " + JSON.stringify(decoded));

            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

// const protect = asyncHandler(async (req, res, next) => {
//     let token;
//
//     if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith("Bearer")
//     ) {
//         try {
//             // extract token from request
//             token = await req.header("Authorization").replace("Bearer ", "");
//             console.log("TOKEN: " + token);
//
//             // verify token
//             const { payload, protectedHeader } = await jose.jwtVerify(
//                 token,
//                 secretKey,
//                 {
//                     issuer: process.env.JWT_ISSUER, // issuer
//                     audience: process.env.JWT_AUDIENCE, // audience
//                 }
//             );
//             // log values to console
//             console.log("PAYLOAD: " + JSON.stringify(payload));
//             console.log("PROTECTED HEADER: " + JSON.stringify(protectedHeader));
//
//             req.user = await User.findById(payload.id).select("-password");
//
//             next();
//         } catch (error) {
//             console.error(error);
//             res.status(401);
//             throw new Error("Not authorized, token failed");
//         }
//     }
//
//     if (!token) {
//         res.status(401);
//         throw new Error("Not authorized, no token");
//     }
// });

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized as an admin!");
    }
};

const editor = (req, res, next) => {
    if (req.user && req.user.isEditor) {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized as an editor!");
    }
};

export { protect, admin, editor };
