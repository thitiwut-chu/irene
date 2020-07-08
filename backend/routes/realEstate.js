const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const path = require("path");
const mkdirp = require('mkdirp');

const multer = require("multer");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { realEstateId } = req.params;
    const dir = path.join("upload", "real-estates", realEstateId);
    await mkdirp(dir)
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now().toString();
    cb(null, file.fieldname + "-" + uniqueSuffix);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false)
  }
}

const upload = multer(
  { 
    storage, 
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter,
  }
);

module.exports = function(rc) {
  router.get("/", rc.listRealEstate);
  router.get("/:realEstateId", rc.getRealEstateById);

  router.use(checkAuth);
  router.post("/", (req, res, next) => rc.createRealEstate(req, res, next));
  router.post("/image/:realEstateId", upload.single("image"), rc.addRealEstateImage);
  router.put("/:realEstateId", (req, res, next) => rc.updateRealEstate(req, res, next))
  router.delete("/:realEstateId", rc.deleteRealEstateById);
  router.delete("/image/:imageId", rc.deleteRealEstateImage);

  return router;
};
