const db = require("../db/index"); // get the connection of the database
const { eq, sql } = require("drizzle-orm");
const booksTable = require("../models/book.model"); // get the model of books table
const authorsTable = require("../models/author.model"); // get the model of authors table

/*
1- eq: equals
*/

// get all books
exports.getAllBooks = async (req, res) => {
  const search = req.query.search;
  try {
    // if search parameter is present then execute the following block
    if (search) {
      const book = await db
        .select()
        .from(booksTable)
        .where(
          sql`to_tsvector('english',${booksTable.title}) @@ to_tsquery('english',${search})`
        ); // this is known as indexing
      if (book.length === 0) {
        return res
          .status(400)
          .json({ success: false, error: `No book found with ${search}` });
      }
      return res.status(200).json(book);
    } else {
      const books = await db.select().from(booksTable);
      res.status(200).json(books); // here express converts the book array in json and set all the appropriate headers and send these books as a json to the frontend.
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error while getting all the books data",
    });
  }
};

// get book by ID
exports.getBookById = async (req, res) => {
  const bookId = req.params.id;
  try {
    const [book] = await db
      .select()
      .from(booksTable)
      .where((table) => eq(table.id, bookId))
      .leftJoin(authorsTable, eq(booksTable.authorId, authorsTable.id))
      .limit(1);

    if (!book)
      res
        .status(404)
        .json({ success: false, error: `Book with id ${id} does not exists!` });

    return res.status(200).json(book);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: `Error while getting data of book id:${bookId}`,
    });
  }
};

// create new book
exports.createNewBook = async (req, res) => {
  const { title, description, authorId } = req.body;
  try {
    if (!title || title === "")
      return res.status(400).json({ error: "Title is required" });

    const [bookCreateResponse] = await db
      .insert(booksTable)
      .values({
        title,
        description,
        authorId,
      })
      .returning({
        // returns the Id of newly created book.
        id: booksTable.id,
      });

    return res
      .status(201)
      .json({ message: "Book added successfully", id: bookCreateResponse.id });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error while creating book" });
  }
};

// delete book by id
exports.deleteBookById = async (req, res) => {
  const bookId = req.params.id;
  try {
    await db.delete(booksTable).where(eq(booksTable.id, bookId));

    return res.status(200).json({ message: `Book with id:${bookId} Deleted!` });
  } catch (error) {
    return res
      .status(400)
      .json({
        success: false,
        error: `Error while deleting book with id:${bookId}`,
      });
  }
};
