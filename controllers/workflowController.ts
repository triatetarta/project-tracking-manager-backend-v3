import { Request, Response } from "express";
import Workflow from "../models/Workflow";
import { IWorkflow } from "../models/interfaces/IWorkflow";

// @desc Get all workflow status
// @route GET /workflows
// @access Private
const getAllWorkflowStatus = async (req: Request, res: Response) => {
  const workflows = await Workflow.find().lean();

  res.json(workflows);
};

// @desc Create new workflow status
// @route POST /workflows
// @access Private
const createWorkflowStatus = async (req: Request, res: Response) => {
  const { user, title, description, category } = req.body;

  if (!user || !title || !description) {
    res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Workflow.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    res.status(409).json({ message: "Duplicate workflow title" });
  }

  const workflow = await Workflow.create({
    user,
    title,
    description,
    category,
  });

  if (workflow) {
    res.status(201).json({ message: "Workflow successfully created" });
  } else {
    res.status(400).json({ message: "Invalid workflow data received" });
  }
};

// @desc Update a workflow status
// @route PATCH /workflows
// @access Private
const updateWorkflowStatus = async (req: Request, res: Response) => {
  const { id, title, description, category } = req.body;

  if (!id || !title || !description || !category) {
    res.status(400).json({ message: "All fields are required" });
  }

  const workflow = (await Workflow.findById(id).exec()) as IWorkflow;

  if (!workflow) {
    res.status(400).json({ message: "Workflow not found" });
  }

  const duplicate = await Workflow.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    res.status(400).json({ message: "Duplicate workflow title" });
  }

  workflow.title = title;
  workflow.description = description;
  workflow.category = category;

  const updatedWorkflow = await workflow?.save();

  res.json(`'${updatedWorkflow?.title}' updated`);
};

// @desc Delete a workflow status
// @route DELETE /workflows
// @access Private
const deleteWorkflowStatus = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "Workflow ID is required" });
  }

  const workflow = (await Workflow.findById(id).exec()) as IWorkflow;

  if (!workflow) {
    res.status(400).json({ message: "Workflow not found" });
  }

  const result = await workflow.remove();

  const reply = `Workflow ${result.title} with ID ${result.id} deleted`;

  res.json(reply);
};

export {
  getAllWorkflowStatus,
  createWorkflowStatus,
  updateWorkflowStatus,
  deleteWorkflowStatus,
};
