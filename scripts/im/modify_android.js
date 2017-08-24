
var modify_common = require("./modify_common");
var conf = require("./config");
var async = require("async");
var fs = require("fs");
var _ = require("lodash");
var path = require("path");
var lineReader = require("line-reader");

function modify(buildInfo, callback) {
    async.waterfall(
        [
            (_cb) => {
                modify_common(buildInfo, conf.androidConfigPath, _cb);
            },
            (_cb) => {
                modifyGradle(buildInfo, conf.androidGradlePaty, _cb);
            }
        ],
        callback
    );
}

function modifyGradle(buildInfo, filepath, callback) {
    try {
        var buildConfig = JSON.parse(buildInfo.buildConfig);
        var modifyHash = {
            version:buildConfig.version,
            applicationId: buildConfig.bundleId
        };

        var str = "";
        var modifyLine = (line) => {
            var modifyLine = line;
            _.forEach(modifyHash, (val, key) => {
                if (modifyLine.indexOf(key) >= 0) {
                    var value = val;
                    if(typeof val == "string"){
                        value = "\""+val+"\"";
                    }
                    modifyLine = "    " + key + " = " + value;
                    return false;
                }
                return true;
            });
            str += (modifyLine+ "\n");
        };

        var fpath = path.join(__dirname, filepath);
        lineReader.eachLine(fpath, function(line, last, cb) {
            modifyLine(line);
            if(last){
                fs.writeFileSync(fpath,str,"utf8");
                callback();
            }
            cb();
        });
    }catch(error){
        callback(error);
    }
}

module.exports = modify;