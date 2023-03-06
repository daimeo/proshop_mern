import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cookieParser from "cookie-parser";
// import cors from "cors";

dotenv.config();

connectDB().then();

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// app.use(express.json()); // for parsing application/json
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser()); //cookie-parser dùng để đọc cookies của request

// app.use(
//     cors({
//         origin: "http://127.0.0.1:5000", //Chan tat ca cac domain khac ngoai domain nay
//         credentials: true, //Để bật cookie HTTP qua CORS
//     })
// );

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
);

app.get("/api/config", (req, res) =>
    res.send({
        url:
            process.env.NODE_ENV === "production"
                ? process.env.PUBLIC_URL
                : process.env.DEV_URL,
        maxFileSize: process.env.MAX_FILE_SIZE,
        base64MaxFileSize: process.env.BASE64_MAX_FILE_SIZE,
        virusTotalURL: process.env.VIRUST_URL,
        virusTotalAPIKey: process.env.X_APIKEY,
    })
);

if (process.env.NODE_ENV !== "production") {
    const __dirname = path.resolve();
    app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
    console.log("DIRNAME: " + __dirname);
}

if (process.env.NODE_ENV === "testing") {
    app.use(express.static(path.join(__dirname, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    );
    // } else {
    //     app.get("/", (req, res) => {
    //         res.send("API is running....");
    //     });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(
        colors.yellow.bold(
            `Server running in ${process.env.NODE_ENV} mode on port ${PORT} at 2023-03-06, 18:21:30`
        )
    );
});
