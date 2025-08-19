const fs = require("node:fs");

exports.loggerMiddleware = function (req, res, next) {
  const date = new Date();
  const log = `[${date}] request-method:${req.method} request-path:${req.path}\n`;
  fs.appendFileSync("log.txt", log, "utf-8");
  next();
};
