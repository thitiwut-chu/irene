const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

class AuthController {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async login(req, res, next) {
    const { username, password } = req.body;
    try {
      let result = await User.model.findOne({ where: { username } });
      if (!result) {
        res.sendStatus(401);
        return;
      }

      const user = result.toJSON();
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          res.status(200).json({
            token: jwt.sign(
              {
                id: user.id,
              }, 
              process.env.JWT_SECRET_KEY, 
              { 
                expiresIn: "8h",
              }
            ),
          });
        } else {
          res.sendStatus(401);
          return;
        }
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  async createUser(req, res, next) {
    let count = await User.model.count();
    if (count > 0) {
      res.status(403).json({
        message: "there can be only one user (admin)"
      });
      return;
    }

    try {
      let result = await  User.model.create({
        username: req.body.username.toLowerCase(),
        password: bcrypt.hashSync(req.body.password, 10),
      });

      const user = result.toJSON();
      res.status(201).json({
        token: jwt.sign(
          {
            id: user.id,
          }, 
          process.env.JWT_SECRET_KEY, 
          { 
            expiresIn: "8h",
          }
        ),
      });
    } catch (error) {
      next(error);
    }
  }

  async checkExpired(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET_KEY);
      res.status(200).json({
        isExpired: false,
      });
    return;
    } catch (error) {
      res.status(200).json({
        isExpired: true,
      });
      return;
    }
  }
}

module.exports = AuthController;
