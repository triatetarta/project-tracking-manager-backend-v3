import { Request, Response } from "express";
import Project from "../models/Project";
import { IProject } from "../models/interfaces/IProject";

// @desc Get all projects
// @route GET /projects
// @access Private
const getAllProjects = async (req: Request, res: Response) => {
  const projects = await Project.find().lean();

  if (!projects.length) {
    res.status(400).json({ message: "No projects found" });
  }

  res.json(projects);
};

// @desc Create new project
// @route POST /projects
// @access Private
const createProject = async (req: Request, res: Response) => {
  const { user, title, description } = req.body;

  if (!user || !title || !description) {
    res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Project.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    res.status(409).json({ message: "Duplicate project title" });
  }

  const project = await Project.create({
    user,
    title,
    description,
  });

  if (project) {
    res.status(201).json({ message: "Project successfully created" });
  } else {
    res.status(400).json({ message: "Invalid project data received" });
  }
};

// @desc Update a project
// @route PATCH /projects
// @access Private
const updateProject = async (req: Request, res: Response) => {
  const { id, title, description, status } = req.body;

  if (!id || !title || !description || !status) {
    res.status(400).json({ message: "All fields are required" });
  }

  const project = (await Project.findById(id).exec()) as IProject;

  if (!project) {
    res.status(400).json({ message: "Project not found" });
  }

  const duplicate = await Project.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    res.status(400).json({ message: "Duplicate project title" });
  }

  project.title = title;
  project.description = description;
  project.status = status;

  const updatedProject = await project?.save();

  res.json(`'${updatedProject?.title}' updated`);
};

// @desc Delete a project
// @route DELETE /projects
// @access Private
const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "Project ID is required" });
  }

  const project = (await Project.findById(id).exec()) as IProject;

  if (!project) {
    res.status(400).json({ message: "Project not found" });
  }

  const result = await project.remove();

  const reply = `Project ${result.title} with ID ${result.id} deleted`;

  res.json(reply);
};

export { createProject, getAllProjects, updateProject, deleteProject };
