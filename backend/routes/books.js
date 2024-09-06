const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharpMiddleware = require("../middleware/sharp-config");

const bookCtrl = require("../controllers/books");

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRating);
router.get("/:id", bookCtrl.getOneBook);
router.post("/", auth, multer, sharpMiddleware, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.rateOneBook);
router.put("/:id", auth, multer, sharpMiddleware, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
