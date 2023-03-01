// const { src, dest, series, parallel } = require("gulp");
// const del = require("del");
// const fs = require("fs");
// const zip = require("gulp-zip");
// const log = require("fancy-log");
// const webpack_stream = require("webpack-stream");
// const webpack_config = require("./webpack.config.js");
// const { setEnvironmentData } = require("worker_threads");
// const exec = require("child_process").exec;

import gulp from "gulp";
// import del from "del";
import { deleteAsync } from "del";
import fs from "fs";
import zip from "gulp-zip";
import log from "fancy-log";
import webpack_stream from "webpack-stream";
import webpack_config from "./webpack.config.js";
import { setEnvironmentData } from "worker_threads";
import { exec } from "child_process";

const paths = {
    prod_build: "./prod-build",
    server_file_name: "api.bundle.js",
    react_src: "./frontend/build/**/*",
    react_dist: "./prod-build/frontend/build",
    zipped_file_name: "mern-prod.zip",
};

async function clean() {
    log("removing the old files in the directory");
    return await deleteAsync("./prod-build/**", { force: true });
}

function createProdBuildFolder() {
    const dir = paths.prod_build;
    log(`Creating the folder if not exist  ${dir}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        log("📁  folder created:", dir);
    }

    return Promise.resolve("the value is ignored");
}

function buildReactCodeTask(cb) {
    log("building React code into the directory");
    return exec(
        "cd ./frontend && npm run build",
        function (err, stdout, stderr) {
            log(stdout);
            log(stderr);
            cb(err);
        }
    );
}

function copyReactCodeTask() {
    log("copying React code into the directory");
    return gulp
        .src(`${paths.react_src}`)
        .pipe(gulp.dest(`${paths.react_dist}`));
}

function copyNodeJSCodeTask() {
    log("building and copying server code into the directory");
    return webpack_stream(webpack_config).pipe(
        gulp.dest(`${paths.prod_build}/backend/`)
    );
}

function zippingTask() {
    log("zipping the code ");
    return gulp
        .src(`${paths.prod_build}/**`)
        .pipe(zip(`${paths.zipped_file_name}`))
        .pipe(gulp.dest(`${paths.prod_build}`));
}

export default gulp.series(
    clean,
    createProdBuildFolder,
    buildReactCodeTask,
    // Run task in parallel
    gulp.parallel(copyReactCodeTask, copyNodeJSCodeTask),
    zippingTask
);