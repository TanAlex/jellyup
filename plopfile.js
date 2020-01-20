const path = require("path");
var normalizedPath = path.join(__dirname, "configs");
const fs = require("fs");

module.exports = function(plop) {
  fs.readdirSync(normalizedPath).forEach(function(file) {
    file = path.join(normalizedPath, file);
    require(file)(plop);
  });
};
