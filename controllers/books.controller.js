const booksTable = require("../models/book.model");
const db=require("../db/index");


exports.getAllBooks = (req, res) => {
  res.setHeader("x-shrav", "shravan chinchkar");
  res.status(200).json(BOOKS); // here express converts the book array in json and set all the appropriate headers and send these books as a json to the frontend.
};

exports.getBookById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ success: false, error: "Id must be of type number" });
  }

  const book = BOOKS.find((book) => book.id === id);
  if (!book)
    res
      .status(404)
      .json({ success: false, error: `Book with id ${id} does not exists!` });
  res.status(200).json(book);
};

exports.createNewBook = (req, res) => {
  const { title, author } = req.body;

  if (!title || title === "")
    return res.status(400).json({ error: "Title is required" });

  if (!author || author === "")
    return res.status(400).json({ error: "Author is required" });

  const id = BOOKS.length + 1;
  const book = { id, title, author };
  BOOKS.push(book);

  res.status(201).json({ message: "Book added successfully", id });
};

exports.deleteBookById=(req, res) => {
  const id = parseInt(req.params.id);

  //return error if id is not a number.
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ success: false, error: "Id must be of type number" });
  }
  const indexToDelete = BOOKS.findIndex((item) => item.id === id);

  //return error if book with that id is not present
  if (indexToDelete < 0)
    return res
      .status(404)
      .json({ success: false, error: `Book with id ${id} does not exists!` });

  BOOKS.splice(indexToDelete, 1); //delets the book from the books array

  return res.status(200).json({ message: "Book Deleted!" });
}
