const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const RealEstate = require("../models/realEstate/realEstate");
const Image = require("../models/realEstate/image");
const Contact = require("../models/realEstate/contact");
const Facility = require("../models/realEstate/facility");
const Position = require("../models/realEstate/position");
const fs = require("fs");
const path = require("path");
const slash = require('slash');

class RealEstateController {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async listRealEstate(req, res, next) {
    const { 
      keyword, 
      province, 
      minPrice, 
      maxPrice,
      offset,
      random,
      limit,
    } = req.query;
    let where = undefined;
    if (keyword) {
      where = {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            address: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            province: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      }
    }
  
    if (province) {
      where = {
        ...where,
        province,
      }
    }
  
    if (minPrice && maxPrice) {
      where = {
        ...where,
        price: {
          [Op.and]: [
            {
              [Op.gte]: minPrice
            },
            {
              [Op.lte]: maxPrice
            },
          ],
        },
      }
    }
  
    let order = [["id", "DESC"]];
  
    if (random ? JSON.parse(random) : false) {
      order = Sequelize.fn("RAND");
    }
  
    try {
      let results = await RealEstate.model.findAndCountAll({
        include: [
          {
            model: Image.model,
            order: [["createdAt", "ASC"]],
            limit: 1,
            attributes: {
              exclude: ["id", "createdAt", "updatedAt", "realEstateId"],
            },
          },
        ],
        limit: Number.parseInt(limit) || 10,
        offset: Number.parseInt(offset) || 0,
        order,
        where,
      });
  
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

  async getRealEstateById(req, res, next) {
    const { realEstateId } = req.params;
    try {
      let result = await RealEstate.model.findOne({
        where: { id: realEstateId },
        include: [
          {
            model: Contact.model,
            attributes: ["phoneNumber", "lineId"],
          }, 
          {
            model: Facility.model,
            attributes: {
              exclude: ["id", "realEstateId", "createdAt", "updatedAt"],
            },
          },
          {
            model: Image.model,
            order: [["createdAt", "DESC"]],
            attributes: {
              exclude: ["createdAt", "updatedAt", "realEstateId"],
            },
          },
          {
            model: Position.model,
            attributes: {
              exclude: ["id", "realEstateId", "createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["id", "updatedAt"],
        }
      });
      if (result === null) {
        res.status(400).json({
          message: "the real estate does not exist",
        });
        return;
      }
      res.status(200).json(result.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async createRealEstate(req, res, next) {
    const { 
      realEstate, 
      contact, 
      facility,
      position,
    } = req.body;

    const t = await this.sequelize.transaction();
    try {
      let re = await RealEstate.model.create({...realEstate}, { transaction: t });
      await Contact.model.create(
        { realEstateId: re.id, ...contact },
        { transaction: t }
      );
      await Facility.model.create(
        { realEstateId: re.id, ...facility },
        { transaction: t },
      );
      await Position.model.create(
        { realEstateId: re.id, ...position },
        { transaction: t },
      );
      await t.commit();
      
      let result = await RealEstate.model.findOne({ 
        where: { id: re.id },
        include: [
          Contact.model,
          Facility.model,
          Image.model,
          Position.model,
        ],
      });
  
      res.status(201).json(result);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  async addRealEstateImage(req, res, next) {
    const { realEstateId } = req.params;
    const { file } = req;
  
    try {
      let result = await  Image.model.create({
        url: slash(file.path),
        realEstateId,
      });
      res.status(201).json(result.toJSON());
    } catch (error) {
      fs.unlinkSync(slash(file.path));
      next(error);
    }
  }

  async deleteRealEstateById(req, res, next) {
    const { realEstateId } = req.params;
    try {
      let imageResults = await Image.model.findAll({ where: { realEstateId }});
      if (imageResults.length > 0) {
        imageResults.forEach(image => {
          fs.unlinkSync(image.url);
        });
      }
  
      const dir = path.join("upload", "real-estates", realEstateId);
      fs.rmdirSync(dir);
  
      await RealEstate.model.destroy({ where: { id: realEstateId }});
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  async updateRealEstate(req, res, next) {
    const { realEstateId } = req.params;
    const { 
      realEstate, 
      contact, 
      facility,
      position,
    } = req.body;
    
    const t = await this.sequelize.transaction();
    try {
      await RealEstate.model.update(
        {...realEstate}, 
        { where: { id: realEstateId }, transaction: t }
      );
      await Contact.model.update(
        { realEstateId, ...contact },
        { where: { realEstateId }, transaction: t }
      );
      await Facility.model.update(
        { realEstateId, ...facility },
        { where: { realEstateId } , transaction: t },
      );
      await Position.model.update(
        { realEstateId, ...position },
        { where: { realEstateId } , transaction: t },
      );
      await t.commit();
      
      let result = await RealEstate.model.findOne({ 
        where: { id: realEstateId },
        include: [
          Contact.model,
          Facility.model,
          Image.model,
          Position.model,
        ],
      });
  
      res.status(200).json(result);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  async deleteRealEstateImage(req, res, next) {
    const { imageId } = req.params;
    try {
      let image = await Image.model.findOne({ where: { id: imageId }});
      fs.unlinkSync(image.url);
      Image.model.destroy({ where: { id: imageId }});
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RealEstateController;
