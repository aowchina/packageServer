
var error = require("../model/error");
module.exports = function (callback) {
    return (err, result) => {
        if (err) {
            callback(error(error.code.DateBaseError,err));
        } else {
            callback(null, result);
        }
    };
};