const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class RealEstateContact extends Model {}

module.exports = {
  init: function(sequelize) {
    RealEstateContact.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        phoneNumber: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        lineId: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      }, 
      {
        sequelize,
        modelName: "realEstateContact",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        underscored: true,
        name: {
          plural: "contacts",
          singular: "contact",
        },
      },
    );
  },
  model: RealEstateContact,
};
