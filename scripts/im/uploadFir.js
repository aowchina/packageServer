var childProcess = require("child_process");
var util = require("util");

module.exports = function(file,token,callback){
    var cmd = util.format("/usr/local/bin/fir publish %s -T %s",file,token);
    childProcess.exec(cmd,(err)=>{
        if(err){
            callback(err);
        }else{
            callback(null);
        }
    });
};