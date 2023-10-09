const { Router } = require("express");
const { TodoModel } = require("../models/Blog.model");
const { UserModel } = require("../models/User.model");

const todoRouter = Router();

todoRouter.get("/", async (req, res) => {
  try {
    // Get all todos
    const todos = await TodoModel.find({ user: req.user_id });
    res.json({ todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

todoRouter.post("/create", async (req, res) => {
  try {
    const { taskname, status, tag } = req.body;

    // Create a new todo
    const newTodo = new TodoModel({
      taskname,
      status,
      tag,
      user: req.user_id,
    });

    await newTodo.save();
    res.json({ message: "Todo created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

todoRouter.put("/edit/:todoID", async (req, res) => {
  try {
    const todoID = req.params.todoID;
    const payload = req.body;

    // Find the todo
    const todo = await TodoModel.findById(todoID);

    // Ensure the logged-in user owns the todo
    if (todo.user.toString() !== req.user_id) {
      return res.status(401).json({ message: "You are unauthorized" });
    }

    await TodoModel.findByIdAndUpdate(todoID, payload);
    res.json({ message: `Todo ${todoID} updated` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

todoRouter.delete("/delete/:todoID", async (req, res) => {
  try {
    const todoID = req.params.todoID;

    // Find the todo
    const todo = await TodoModel.findById(todoID);

    // Ensure the logged-in user owns the todo
    if (todo.user.toString() !== req.user_id) {
      return res.status(401).json({ message: "You are unauthorized" });
    }

    await TodoModel.findByIdAndDelete(todoID);
    res.json({ message: `Todo ${todoID} deleted` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = { todoRouter };