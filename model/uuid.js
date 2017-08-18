
var uuid = require("node-uuid");

module.exports = function (){
    return uuid.v1().split("-").join("");
};