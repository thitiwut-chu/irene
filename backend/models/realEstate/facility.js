const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class RealEstateFacility extends Model {}

module.exports = {
  init: function(sequelize) {
    RealEstateFacility.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        fan: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        airConditioner: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        waterHeater: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        freeWirelessInternet: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        motorcycleParkingLot: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        carParkingLot: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        elevator: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
      }, 
      {
        sequelize,
        modelName: "realEstateFacility",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        underscored: true,
        name: {
          plural: "facilities",
          singular: "facility",
        },
      },
    );
  },
  model: RealEstateFacility,
};
