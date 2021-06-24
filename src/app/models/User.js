const { Model, DataTypes } = require("sequelize");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/authConfig.json");

class User extends Model {
  static init(connection) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: {
          type: Sequelize.VIRTUAL(Sequelize.STRING),
        },
        password_hash: DataTypes.STRING,

        password_reset_token: {
          type: Sequelize.STRING,
          select: false,
        },
        password_reset_expires: {
          type: Sequelize.DATE,
          select: false,
        },
      },

      { sequelize: connection, tableName: "users" }
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
  }
  checkPassword(password) {
    return bcrypt.compare(String(password), this.password_hash);
  }

  tokenGenerate(params = {}) {
    return jwt.sign({ id: this.id }, authConfig.secret, {
      expiresIn: 86400,
    });
  }
  static associate(models) {
    this.hasMany(models.Project, {
      foreignKey: "users_id",
      as: "projects",
    });
    this.hasMany(models.Task, { foreignKey: "users_id", as: "tasks" });
  }
}

module.exports = User;
