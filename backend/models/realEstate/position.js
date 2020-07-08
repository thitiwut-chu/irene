const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class RealEstatePosition extends Model {}

module.exports = {
  init: function(sequelize) {
    RealEstatePosition.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        latitude: {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        longitude: {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
      }, 
      {
        sequelize,
        modelName: "realEstatePosition",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        underscored: true,
        name: {
          plural: "positions",
          singular: "position",
        },
      },
    );
  },
  model: RealEstatePosition,
};
