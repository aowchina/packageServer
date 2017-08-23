var modify_common = require("./modify_common");
var conf = require("./config");
function modify(buildInfo,callback){
    modify_common(buildInfo,conf.iosConfigPath,callback);
}   
module.exports = modify;