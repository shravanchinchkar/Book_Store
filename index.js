const express = require("express");
const bookRouter = require("./routes/book.routes");
const { loggerMiddleware } = require("./middlewares/logger");

const app = express();
const PORT = 8000;

// Middleware are like Plugins
// if some data comes from the FE and it has a header i.e application/json then it will do all the transformations and give the actual data in request.body 👇
app.use(express.json());
app.use(loggerMiddleware);

//Routes also knows as API

// If any request comes to /books then go to the bookRouter👇
app.use("/books", bookRouter);

app.listen(PORT, () => console.log(`Server is running on PORT:${PORT}`));
