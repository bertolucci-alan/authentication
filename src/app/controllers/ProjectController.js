const authMiddleware = require("../middlewares/auth");
const { update, destroy } = require("../models/Project");
const Project = require("../models/Project");
const User = require("../models/User");

module.exports = {
  async show(req, res) {
    return res.json({ ok: true, user: req.userId });
  },

  async store(req, res) {
    const { title, description } = req.body;
    const { users_id } = req.params;

    const user = await User.findByPk(users_id);

    if (!user) return res.status(400).json({ error: "User not found" });

    const project = await Project.create({ title, users_id, description });
    return res.json(project);
  },
  async index(req, res) {
    const { users_id } = req.params;
    const user = await User.findByPk(users_id);
    if (!user) return res.status(400).json({ error: "User not found" });

    const project = await Project.findAll();
    if (!project) return res.status(400).json({ error: "Project not found" });

    return res.json(project);
  },
  async detail(req, res) {
    const { users_id, projects_id } = req.params;

    const user = await User.findByPk(users_id);
    if (!user) return res.status(400).json({ error: "User not found" });

    const project = await Project.findByPk(projects_id);
    if (!project) return res.status(400).json({ error: "Project not found" });

    return res.json(project);
  },
  async update(req, res) {
    const { users_id, projects_id } = req.params;
    const { title, description } = req.body;

    const user = await User.findByPk(users_id);
    if (!user) return res.status(400).json({ error: "User not found" });

    const projects = await Project.findByPk(projects_id);
    if (!project) return res.status(400).json({ error: "Project not found" });

    projects.update(req.body);
    return res.json(projects);
  },
  async destroy(req, res) {
    const { users_id, projects_id } = req.params;

    const user = await User.findByPk(users_id);
    if (!user) return res.status(400).json({ error: "User not found" });

    const project = await User.findByPk(projects_id);
    if (!project) return res.status(400).json({ error: "Project not found" });

    project.destroy(req.body);
    return res.json();
  },
};
