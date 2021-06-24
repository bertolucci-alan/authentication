const Task = require("../models/Task");
const User = require("../models/User");
const Project = require("../models/Project");

module.exports = {
  async store(req, res) {
    const { title, completed } = req.body;
    const { users_id } = req.params;
    const { projects_id } = req.params;

    const user = await User.findByPk(users_id, {
      attributes: ["name"],
    });
    if (!user) return res.status(400).json({ error: "User not found" });

    const project = await Project.findByPk(projects_id, {
      attributes: ["title", "description", "users_id"],
    });
    if (!project) return res.status(400).json({ error: "Project not found" });

    const task = await Task.create({ title, users_id, projects_id });

    return res.json({ task });
  },
  async index(req, res) {
    const { projects_id } = req.params;

    const project = await Project.findByPk(projects_id);

    if (!project) return res.status(400).json({ error: "Project not found" });

    const task = await Task.findAll({
      include: [
        { model: Project, as: "tasksproject", attributes: ["title"] },

        { model: User, as: "usertask", attributes: ["name"] },
      ],
    });

    return res.json(task);
  },
  async detail(req, res) {
    const { tasks_id } = req.params;

    const task = await Task.findByPk(tasks_id, {
      include: [
        {
          model: Project,
          as: "tasksproject",
          attributes: ["title"],
        },
        {
          model: User,
          as: "usertask",
          attributes: ["name"],
        },
      ],
    });
    if (!task) return res.status(400).json({ error: "Task not found" });

    return res.json(task);
  },
  async update(req, res) {
    const { tasks_id } = req.params;

    const task = await Task.findByPk(tasks_id);

    if (!task) return res.status(400).json({ error: "Task not found" });

    task.update(req.body);
    return res.json(task);
  },
  async destroy(req, res) {
    const { tasks_id } = req.params;
    const task = await Task.findByPk(tasks_id);

    if (!task) return res.status(400).json({ error: "Task not found" });
    task.destroy(req.body);
    return res.json({ sucess: "task deleted" });
  },
};
