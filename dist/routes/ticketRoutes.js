"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ticketController_1 = require("../controllers/ticketController");
const verifyJWT_1 = require("../middleware/verifyJWT");
const router = express_1.default.Router();
router.use(verifyJWT_1.verifyJWT);
router
    .route("/")
    .get(ticketController_1.getAllTickets)
    .post(ticketController_1.createTicket)
    .patch(ticketController_1.updateTicket)
    .delete(ticketController_1.deleteTicket);
exports.default = router;
