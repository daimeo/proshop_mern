import mongoose from "mongoose";
// import { MongoClient } from "mongodb";

// TODO: Use Mongodb native driver instead of mongoose
const connectDB = async () => {
    mongoose.set("strictQuery", true);
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // useUnifiedTopology: true,
            // useNewUrlParser: true
            // useCreateIndex: true,
        });

        console.log(
            `MongoDB Connected: ${conn.connection.host}`.blue.underline
        );
    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
    // await MongoClient.connect(process.env.MONGO_URI, (err, client) => {
    //     if (err) throw err;
    //
    //     const db = client.db("test");
    //
    //     db.collection("products")
    //         .find()
    //         .toArray((err, result) => {
    //             if (err) throw err;
    //
    //             console.log(result);
    //         });
    // });
};

export default connectDB;
