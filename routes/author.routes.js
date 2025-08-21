const express = require("express");
const controller = require("../controllers/authors.controller");

const router = express.Router();

router.get("/", controller.getAllAuthors);
router.get("/:id", controller.getAuthorById);
router.post("/", controller.createAuthor);
router.get("/:id/books", controller.getAllBooksByAuthor);

module.exports = router;
