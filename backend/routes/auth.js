const express = require("express");
const router = express.Router();

module.exports = function(ac) {
  router.post("/login", ac.login);
  router.post("/signup", ac.createUser);
  router.get("/check-token-expired", ac.checkExpired);

  return router;
};