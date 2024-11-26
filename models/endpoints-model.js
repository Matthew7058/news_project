const fs = require("fs/promises");

exports.displayEndpoints = () => {
    return fs.readFile("./endpoints.json", "utf-8").then((result) => {
        return JSON.parse(result);
      });
  };