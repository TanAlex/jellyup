const config = require("./config");

function debug() {
    if(config.debug) {
        console.log(...arguments);
    }
}


/**
 * Format the input of the user in appropriate format for the application.
 * @param {object} inputData 
 */
function formatInputData(inputData) {
    inputData.accounts = inputData.accounts.split(',').map(value => value.trim());
    for(let i=0; i<inputData.accounts.length; i++) {
        let firstSeparatorIndex = inputData.accounts[i].indexOf(':');
        let secondSeparatorIndex = inputData.accounts[i].indexOf(':', firstSeparatorIndex + 1);
        let env = inputData.accounts[i].substring(0, firstSeparatorIndex).trim();
        let id = inputData.accounts[i].substring(firstSeparatorIndex + 1, secondSeparatorIndex).trim();
        let role = inputData.accounts[i].substring(secondSeparatorIndex + 1).trim();
        inputData.accounts[i] = {env, id, role}
    }
}

module.exports = {
    debug,
    formatInputData
}