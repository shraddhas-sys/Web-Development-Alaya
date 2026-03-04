const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/favoriteController");

router.get("/", auth, ctrl.listMine);
router.post("/", auth, ctrl.add);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
