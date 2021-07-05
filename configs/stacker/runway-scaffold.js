const stacker = require('../../generators/stacker');

module.exports = function (plop) {
    plop.setGenerator('stacker:scaffold-runway', stacker.runwayGenerator);
}