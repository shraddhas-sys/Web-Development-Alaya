const express = require("express");
const router = express.Router();
const { addSession, getSessions } = require("../controllers/sessionController");

router.post("/add", addSession);
router.get("/all/:userId", getSessions);

module.exports = router;