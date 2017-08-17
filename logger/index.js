"use strict";
const log4js = require("log4js");
const conf = require("../config/log4js");

log4js.configure(conf);

exports.logger = log4js.getLogger("app");
exports.log4js = log4js;
