"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./middleware/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = require("./config/corsOptions");
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnect_1 = require("./config/dbConnect");
// Routes
const root_1 = __importDefault(require("./routes/root"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
(0, dbConnect_1.connectDB)();
app.use(logger_1.logger);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
app.use("/", express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/", root_1.default);
app.use("/auth", authRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/tickets", ticketRoutes_1.default);
app.use("/projects", projectRoutes_1.default);
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path_1.default.join(__dirname, "views/404.html"));
    }
    else if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
    }
    else {
        res.type("text").send("404 Not Found");
    }
});
app.use(errorHandler_1.errorHandler);
mongoose_1.default.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`✔ Server running on port ${PORT}`));
});
mongoose_1.default.connection.on("error", (err) => {
    console.log(err);
    (0, logger_1.logEvents)(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
});
