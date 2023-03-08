import path from "path";
import webpack from "webpack";

const environment = process.env.ENVIRONMENT;

console.log("environment:::::", environment);

let ENVIRONMENT_VARIABLES = {};

if (environment === "development") {
    ENVIRONMENT_VARIABLES = {
        "process.env.NODE_ENV": JSON.stringify("development"),
        "process.env.PORT": JSON.stringify("5000"),
        "process.env.MONGO_URI": JSON.stringify(
            "mongodb://tester:S%40igonbpo%40123@localhost:27017/?retryWrites=true&w=majority"
        ),
        "process.env.DEV_URL": JSON.stringify("http://localhost:8081"),
        "process.env.JWT_SECRET": JSON.stringify(
            "6a211d317c426507dfa7793ac47213f78c518a6581521304718be46f58c1cbac90ec6b1320eae112dd547e7bdaf79358ee5334bd9c91dc0bf1aba68d4beca303"
        ),
        "process.env.JWT_EXPIRATION_TIME": JSON.stringify("8h"),
        "process.env.COOKIE_EXPIRATION_TIME": JSON.stringify(
            10 * 60 * 60 * 1000
        ),
        "process.env.PAYPAL_CLIENT_ID": JSON.stringify(
            "AfqxmsBjat-kovUrwnU9-s0_WsH-upYU0X75-7u-3tio8HB_1KkdX5D3u5hiFLxrXIC0r-yDXWyaQZEA"
        ),
        "process.env.MAX_FILE_SIZE": JSON.stringify(10),
        "process.env.BASE64_MAX_FILE_SIZE": JSON.stringify(5),
        "process.env.VIRUST_URL": JSON.stringify(
            "https://www.virustotal.com/api/v3/urls"
        ),
        "process.env.X_APIKEY": JSON.stringify(
            "e023594f7729521925cb9eac971ebb01440e9d5a55c69382d67a0892f4708c0c"
        ),
    };
} else if (environment === "production") {
    ENVIRONMENT_VARIABLES = {
        "process.env.NODE_ENV": JSON.stringify("production"),
        "process.env.PORT": JSON.stringify("5000"),
        "process.env.MONGO_URI": JSON.stringify(
            "mongodb://tester:S%40igonbpo%40123@localhost:27017/?retryWrites=true&w=majority"
        ),
        "process.env.DEV_URL": JSON.stringify("https://minhman.xyz"),
        "process.env.JWT_SECRET": JSON.stringify(
            "6a211d317c426507dfa7793ac47213f78c518a6581521304718be46f58c1cbac90ec6b1320eae112dd547e7bdaf79358ee5334bd9c91dc0bf1aba68d4beca303"
        ),
        "process.env.JWT_EXPIRATION_TIME": JSON.stringify("8h"),
        "process.env.COOKIE_EXPIRATION_TIME": JSON.stringify(
            10 * 60 * 60 * 1000
        ),
        "process.env.PAYPAL_CLIENT_ID": JSON.stringify(
            "AfqxmsBjat-kovUrwnU9-s0_WsH-upYU0X75-7u-3tio8HB_1KkdX5D3u5hiFLxrXIC0r-yDXWyaQZEA"
        ),
        "process.env.MAX_FILE_SIZE": JSON.stringify(10),
        "process.env.BASE64_MAX_FILE_SIZE": JSON.stringify(5),
        "process.env.VIRUST_URL": JSON.stringify(
            "https://www.virustotal.com/api/v3/urls"
        ),
        "process.env.X_APIKEY": JSON.stringify(
            "e023594f7729521925cb9eac971ebb01440e9d5a55c69382d67a0892f4708c0c"
        ),
    };
}

const __dirname = path.resolve();

export default {
    entry: "./backend/server.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "api.bundle.js",
    },
    target: "node",
    plugins: [new webpack.DefinePlugin(ENVIRONMENT_VARIABLES)],
};
