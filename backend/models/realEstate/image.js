const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class RealEstateImage extends Model {}

module.exports = {
  init: function(sequelize) {
    RealEstateImage.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        url: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      }, 
      {
        sequelize,
        modelName: "realEstateImage",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        underscored: true,
        name: {
          plural: "images",
          singular: "image",
        },
      },
    );
  },
  model: RealEstateImage,
};
