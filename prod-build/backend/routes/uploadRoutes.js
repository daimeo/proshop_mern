import path from "path";
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import * as fs from "fs";
// import fs from "fs";
//
// const port = process.env.APP_PORT; // 8081
// const appUrl = process.env.APP_URL; // http://localhost

dotenv.config();

const router = express.Router();

// let counter = 1;

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb("Images only!");
    }
}

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * process.env.MAX_FILE_SIZE, // 10MB
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Single file
router.post("/", upload.single("image"), (req, res) => {
    const fileExt = req.file.originalname.split(".")[1];
    const PName = req.body.productName.replace(/ /g, "_");
    const PPrice = req.body.productPrice;
    const newFileName = `${PName}-${PPrice}-${Date.now()}.${fileExt}`;
    const newPath = `${req.file.destination}${newFileName}`;

    // Rename the file before saving
    fs.rename(req.file.path, newPath, (err) => {
        if (err) {
            console.error(err);
            res.status(500);
            throw new Error("Error occurred while uploading the file.");
        } else {
            res.send(`/${newPath}`);
        }
    });

    // console.log(`REQ BODY: ` + JSON.stringify(req.body, null, 2));
    // res.send(`/${req.file.path}`);
    // console.log(`/${req.file.path}`);
});

// Multiple file
router.post("/multiple", upload.array("images", 5), (req, res) => {
    res.send(`/${req.file.path}`);
    console.log(`/${req.file.path}`);
});

// router.post("/", upload.single("image"), (req, res) => {
//     if (req.file) {
//         res.send("Single file uploaded successfully");
//     } else {
//         res.status(400).send("Please upload a valid image");
//     }
// });

// router.post("/multiple", upload.array("images", 5), (req, res) => {
//     if (req.files) {
//         res.send("Multiple files uploaded successfully");
//     } else {
//         res.status(400).send("Please upload a valid images");
//     }
// });

// const uploadBase64Image = async (req, res, next) => {
//     try {
//         const encoded = req.body.image;
//         console.log("ENCODED: ", encoded);
//
//         const base64ToArray = encoded.split(";base64,");
//         // const prefix = base64ToArray[0];
//         // const extension = prefix.replace(/^data:image\//, '');
//         const extension = "txt";
//
//         // if (extension === 'jpeg' || extension === 'jpg' || extension === 'png')
//         // {
//         const imageData = base64ToArray[1];
//         const fileName = ((new Date().getTime() / 1000) | 0) + "." + extension;
//         const __dirname = path.resolve();
//         // console.log("DIR: " + __dirname);
//         const imagePath = path.join(__dirname, "./../uploads/") + fileName;
//         console.log(imagePath);
//         fs.writeFileSync(imagePath, imageData, { encoding: "base64" });
//
//         return res.status(201).json({
//             error: false,
//             message: "Base64 Image was successfully uploaded.",
//             url: `${appUrl}:${port}/images/${fileName}`,
//         });
//         // }
//         // else {
//         //     return res.status(403).json({
//         //         error: true,
//         //         message: "Base64 data not valid!",
//         //     });
//         // }
//     } catch (e) {
//         return res.status(403).json({
//             error: true,
//             message: e.message,
//         });
//     }
// };
//
// router.post("/", upload.single("image"), uploadBase64Image);

export default router;
