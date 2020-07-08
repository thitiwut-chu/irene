const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class RealEstate extends Model {}

module.exports = {
  init: function(sequelize) {
    RealEstate.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(63),
          allowNull: false,
        },
        price: {
          type: Sequelize.MEDIUMINT({
            unsigned: true,
          }),
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(1023),
          allowNull: false,
        },
        postalCode: {
          type: Sequelize.STRING(5),
          allowNull: false,
        },
        province: {
          type: Sequelize.STRING(31),
          allowNull: false,
        },
      }, 
      {
        sequelize,
        modelName: "realEstate",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        underscored: true,
      },
    );
  },
  model: RealEstate,
};
