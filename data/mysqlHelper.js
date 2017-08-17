var mysql = require("mysql");
var conf = require("../config/mysql");
var logger = require("../logger");

var pool = mysql.createPool(conf);

function query() {
    var callback = arguments[arguments.length - 1];
    var args = [];
    for (var i = 0; i < arguments.length - 1; i++) {
        args.push(arguments[i]);
    }
    pool.getConnection((err, connection) => {
        if (err) {
            logger.error("mysql get connection error");
            callback(err);
        } else {
            var resultHandler = (err, result) => {
                if (err) {
                    callback(err.message);
                } else {
                    callback(null, result);
                }
                connection.release();
            };
            args.push(resultHandler);
            connection.query.apply(connection, args);
        }
    });
}

module.exports = query;