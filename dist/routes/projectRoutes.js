"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const verifyJWT_1 = require("../middleware/verifyJWT");
const router = express_1.default.Router();
router.use(verifyJWT_1.verifyJWT);
router
    .route("/")
    .get(projectController_1.getAllProjects)
    .post(projectController_1.createProject)
    .patch(projectController_1.updateProject)
    .delete(projectController_1.deleteProject);
exports.default = router;
