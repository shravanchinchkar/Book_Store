const { sql } = require("drizzle-orm");
const authorsTable = require("./author.model");
const { pgTable, uuid, varchar, text, index } = require("drizzle-orm/pg-core");

const booksTable = pgTable(
  "books",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: varchar({ length: 100 }).notNull(),
    description: text(),
    authorId: uuid()
      .references(() => authorsTable.id)
      .notNull(), // here authorId is the foreign key and creates a relationship between booksTable and authorsTable
  },
  (table) => ({
    searchIndexOnTitle: index("title_index").using(
      "gin",
      sql`to_tsvector('english',${table.title})`
    ), // here table means booksTable, applied Search Index to the title of the book
  })
);

module.exports = booksTable; // this is known as default export
