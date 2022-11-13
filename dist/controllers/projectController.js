"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getAllProjects = exports.createProject = void 0;
const Project_1 = __importDefault(require("../models/Project"));
// @desc Get all projects
// @route GET /projects
// @access Private
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield Project_1.default.find().lean();
    if (!projects.length) {
        res.status(400).json({ message: "No projects found" });
    }
    res.json(projects);
});
exports.getAllProjects = getAllProjects;
// @desc Create new project
// @route POST /projects
// @access Private
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, title, description, status } = req.body;
    if (!user || !title || !description || !status) {
        res.status(400).json({ message: "All fields are required" });
    }
    const duplicate = yield Project_1.default.findOne({ title })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    if (duplicate) {
        res.status(409).json({ message: "Duplicate project title" });
    }
    const project = yield Project_1.default.create({
        user,
        title,
        description,
        status,
    });
    if (project) {
        res.status(201).json({ message: "Project successfully created" });
    }
    else {
        res.status(400).json({ message: "Invalid project data received" });
    }
});
exports.createProject = createProject;
// @desc Update a project
// @route PATCH /projects
// @access Private
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, description, status } = req.body;
    if (!id || !title || !description || !status) {
        res.status(400).json({ message: "All fields are required" });
    }
    const project = (yield Project_1.default.findById(id).exec());
    if (!project) {
        res.status(400).json({ message: "Project not found" });
    }
    const duplicate = yield Project_1.default.findOne({ title })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    if (duplicate && (duplicate === null || duplicate === void 0 ? void 0 : duplicate._id.toString()) !== id) {
        res.status(400).json({ message: "Duplicate project title" });
    }
    project.title = title;
    project.description = description;
    project.status = status;
    const updatedProject = yield (project === null || project === void 0 ? void 0 : project.save());
    res.json(`'${updatedProject === null || updatedProject === void 0 ? void 0 : updatedProject.title}' updated`);
});
exports.updateProject = updateProject;
// @desc Delete a project
// @route DELETE /projects
// @access Private
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ message: "Project ID is required" });
    }
    const project = (yield Project_1.default.findById(id).exec());
    if (!project) {
        res.status(400).json({ message: "Project not found" });
    }
    const result = yield project.remove();
    const reply = `Project ${result.title} with ID ${result.id} deleted`;
    res.json(reply);
});
exports.deleteProject = deleteProject;
