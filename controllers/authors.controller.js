const { eq } = require("drizzle-orm");
const db = require("../db/index"); // get the connection of the database
const authorsTable = require("../models/author.model"); // get the model of authors table
const booksTable = require("../models/book.model"); //get the model of books table

// get all the authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await db.select().from(authorsTable);
    if (!authors) {
      return res.status(500).json({
        success: false,
        error: "Error while getting data of all the authors",
      });
    } else {
      return res.status(200).json({ success: true, authors });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error while getting data of all the authors",
    });
  }
};

// get all the authors by ID
exports.getAuthorById = async (req, res) => {
  const id = req.params.id;
  try {
    const [author] = await db
      .select()
      .from(authorsTable)
      .where(eq(authorsTable.id, id))
      .limit(1);
    if (!author) {
      return res.status(404).json({
        success: false,
        error: `Author with id: ${id} does not exists!`,
      });
    } else {
      return res.status(200).json({ success: true, author });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Error while getting data of author by ID",
    });
  }
};

// create a author
exports.createAuthor = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    // check if the email already exists.
    const [isAuthorEmailExists] = await db
      .select()
      .from(authorsTable)
      .where(eq(authorsTable.email, email));

    // if exists throw error
    if (isAuthorEmailExists) {
      return res.status(400).json({
        success: false,
        error: "Email already in use!",
      });
    }
    // if not then create the new author
    else {
      const [createAuthor] = await db
        .insert(authorsTable)
        .values({
          firstName,
          lastName,
          email,
        })
        .returning({
          id: authorsTable.id,
        });

      if (!createAuthor)
        return res
          .status(400)
          .json({ success: false, message: "Error while creating author!" });

      return res.status(200).json({
        success: true,
        message: `Author of Id: ${createAuthor.id} created successfully!`,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error while creating new author!" });
  }
};

// get all the books of specific author
exports.getAllBooksByAuthor = async (req, res) => {
  const authorId = req.params.id;
  try {
    const booksByAuthor = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.authorId, authorId));
    if (booksByAuthor.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Author with id:${id} have not written any book yet`,
      });
    } else {
      return res.status(200).json({ success: true, booksByAuthor });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: "Error while getting books of the author",
    });
  }
};
