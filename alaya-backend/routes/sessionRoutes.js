const express = require("express");
const router = express.Router();
const { addSession, getSessions } = require("../controllers/sessionController");
const auth = require("../middleware/auth");

router.post("/add", auth, addSession);
router.get("/all/:userId", auth, getSessions);
router.patch("/:id/complete", auth, require("../controllers/sessionController").completeSession);
router.delete("/:id", auth, require("../controllers/sessionController").deleteSession);

module.exports = router;
