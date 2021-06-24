const { Model, DataTypes, Sequelize } = require("sequelize");

class Project extends Model {
  static init(connection) {
    super.init(
      {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
      },
      {
        sequelize: connection,
        tableName: "projects",
      }
    );
  }
  static associate(models) {
    this.belongsTo(
      models.User,
      {
        foreignKey: "users_id",
        as: "userproject",
      },
      this.hasMany(models.Task, {
        foreignKey: "projects_id",
        as: "projecttask",
      })
    );
  }
}

module.exports = Project;
