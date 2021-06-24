const express = require("express");
const router = express.Router();
const { addToken, getToken } = require("../controllers/refresh-tokens");

router.route("/").post(addToken).get(getToken);

module.exports = router;
