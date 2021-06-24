const express = require("express");

const UserController = require("../app/controllers/UserController");
const ProjectController = require("../app/controllers/ProjectController");
const AuthController = require("../app/controllers/AuthController");
const TaskController = require("../app/controllers/TaskContoller");

const authMiddleware = require("../app/middlewares/auth");

const routes = express.Router();

routes.post("/user", UserController.store);
routes.get("/users", UserController.index);
routes.get("/users/:users_id", UserController.detail);
routes.delete("/users/:users_id", UserController.destroy);

routes.post("/authenticate", AuthController.autenticate);

routes.get("/user/project", authMiddleware, ProjectController.show);
routes.post("/user/forgot-password", AuthController.update);

routes.post("/authenticate/reset_password", AuthController.store);

routes.post("/projects/:users_id", ProjectController.store);
routes.get("/projects/:users_id", ProjectController.index);
routes.get("/projects/:users_id/:projects_id", ProjectController.detail);
routes.put("/projects/:users_id/:projects_id", ProjectController.update);
routes.delete("/projects/:users_id/:projects_id", ProjectController.destroy);

routes.post(
  "/projects/:projects_id/users/:users_id/tasks",
  TaskController.store
);
routes.get("/tasks/project/:projects_id", TaskController.index);

routes.get("/task/:tasks_id", TaskController.detail);

routes.put("/task/:tasks_id", TaskController.update);
routes.delete("/task/:tasks_id", TaskController.destroy);

module.exports = routes;
