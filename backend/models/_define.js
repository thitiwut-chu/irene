const RealEstateContact = require("./realEstate/contact"),
    RealEstateFacility = require("../models/realEstate/facility"),
    RealEstateImage = require("../models/realEstate/image"),
    RealEstatePosition = require("../models/realEstate/position"),
    RealEstate = require("../models/realEstate/realEstate"),
    User = require("../models/user");

module.exports = function(sequelize) {
  RealEstateContact.init(sequelize);
  RealEstateFacility.init(sequelize);
  RealEstateImage.init(sequelize);
  RealEstatePosition.init(sequelize);
  RealEstate.init(sequelize);
  User.init(sequelize);

  RealEstate.model.hasMany(RealEstateImage.model, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: "CASCADE",
  });
  
  RealEstate.model.hasOne(RealEstateContact.model, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: "CASCADE",
  });
  
  RealEstate.model.hasOne(RealEstateFacility.model, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: "CASCADE",
  });
  
  RealEstate.model.hasOne(RealEstatePosition.model, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: "CASCADE",
  });
}
