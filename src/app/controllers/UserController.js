const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

module.exports = {
  async store(req, res) {
    try {
      const { name, email, password_hash, password } = req.body;

      const user = await User.create({ name, email, password_hash, password });

      user.password = undefined;
      user.password_reset_token = undefined;
      user.password_reset_expires = undefined;

      return res.json({ user, token: user.tokenGenerate({ id: user.id }) });
    } catch {
      res.status(400).json({ error: "Registration failed" });
    }
  },
  async index(req, res) {
    const user = await User.findAll({
      attributes: ["name"],
    });
    return res.json({ user });
  },
  async detail(req, res) {
    const { users_id, projects_id } = req.params;

    const user = await User.findByPk(users_id, {
      attributes: ["name"],
      include: [
        {
          model: Project,
          as: "projects",
          attributes: ["title"],
        },
        {
          model: Task,
          as: "tasks",
          attributes: ["title"],
        },
      ],
    });

    if (!user) return res.status(400).json({ error: "User not found" });

    return res.json(user);
  },

  async destroy(req, res) {
    const { users_id } = req.params;

    const user = await User.findByPk(users_id);
    if (!user) return res.status(400).json({ error: "User not found" });

    user.destroy(req.body);
    return res.json({ sucess: "User deleted" });
  },
};
