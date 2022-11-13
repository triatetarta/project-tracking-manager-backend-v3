"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("./logger");
const errorHandler = (err, req, res, next) => {
    (0, logger_1.logEvents)(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, "errLog.log");
    console.log(err.stack);
    const status = res.statusCode ? res.statusCode : 500; // server error
    res.status(status);
    res.json({ message: err.message });
};
exports.errorHandler = errorHandler;
