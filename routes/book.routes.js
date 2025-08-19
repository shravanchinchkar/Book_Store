const express = require("express");
const controller = require("../controllers/books.controller");

const router = express.Router(); // express gives us functionality for routers

//gets all the books
router.get("/", controller.getAllBooks);

//get specific book
router.get("/:id", controller.getBookById);

//create a book
router.post("/", controller.createNewBook);

//delete a specific book
router.delete("/:id", controller.deleteBookById);

module.exports = router;
