var logger = require("../logger").logger;
var company = require("../data/company");
var user = require("../model/user");
var userDB = require("../data/user");
var buildDB = require("../data/build");
var userConfig = require("../config/account");
var process = require("process");

var async = require("async");

function init() {
    async.waterfall([
        (_cb) => {
            company.initCompany(_cb);
        },
        (_result, _cb) => {
            userDB.initUser(_cb);
        },
        (_result, _cb) => {
            user.addUser(userConfig.username, userConfig.password, userConfig.nickname, _cb);
        },
        (_cb) =>{
            buildDB.initBuild(_cb);
        }
    ],
    (err) => {
        if (err) {
            logger.error(err);
            process.exit(-1);
        } else {
            process.exit(0);
        }
    }
    );
}

init();


