const { Model, DataTypes } = require("sequelize");

class Task extends Model {
  static init(connection) {
    super.init(
      {
        title: DataTypes.STRING,
        completed: DataTypes.BOOLEAN,
      },
      {
        sequelize: connection,
        tableName: "tasks",
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "users_id", as: "usertask" });
    this.belongsTo(models.Project, {
      foreignKey: "projects_id",
      as: "tasksproject",
    });
  }
}

module.exports = Task;
