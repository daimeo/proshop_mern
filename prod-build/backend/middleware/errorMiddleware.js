import createError from "http-errors";

// TODO: Study ELK https://viblo.asia/p/elk-stack-3-anh-em-sieu-nhan-trong-quan-ly-logs-oOVlYLArZ8W
const notFound = (req, res, next) => {
    // const error = new Error(`Not Found - ${req.originalUrl}`);
    // res.status(404);
    // next(error);
    next(createError.NotFound(`Not Found - ${req.originalUrl} ANDD`));
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        status: err.status || 500,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export { notFound, errorHandler };
