const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class User extends Model {}

module.exports = {
  init: function(sequelize) {
    User.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        username: {
          type: Sequelize.STRING(31),
          unique: true,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(60, true),
          allowNull: false,
        },
      }, 
      {
        sequelize,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        underscored: true,
      },
    );
  },
  model: User,
};