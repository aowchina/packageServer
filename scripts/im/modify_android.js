
var modify_common = require("./modify_common");
var conf = require("./config");
var async = require("async");
var fs = require("fs");
var _ = require("lodash");
var path = require("path");
var lineReader = require("line-reader");

function modify(buildInfo, callback) {
    var workspace = global.WORKSPACE;
    async.waterfall(
        [
            (_cb) => {
                modify_common(buildInfo, path.join(workspace,conf.androidConfigPath), _cb);
            },
            (_cb) => {
                modifyGradle(buildInfo, path.join(workspace,conf.androidGradlePaty), _cb);
            }
        ],
        callback
    );
}

function modifyGradle(buildInfo, fpath, callback) {
    try {
        var buildConfig = JSON.parse(buildInfo.buildConfig);
        var modifyHash = _.cloneDeep(buildConfig);
        modifyHash.app_id = buildConfig.bundleId;
        modifyHash.version_code = parseInt(buildConfig.buildVersion);
        modifyHash.version_name = buildConfig.version;

        var str = "";
        var modifyLine = (line) => {
            var modifyLine = line;
            _.forEach(modifyHash, (val, key) => {
                var ukey = convertCamelToUnderline(key);
                if (modifyLine.indexOf(ukey) >= 0) {
                    var value = val;
                    if(typeof val == "string"){
                        value = "\""+val+"\"";
                    }
                    modifyLine = "    " + ukey + " = " + value;
                    return false;
                }
                return true;
            });
            str += (modifyLine+ "\n");
        };

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

function convertCamelToUnderline(camel){
    return camel.replace(/([A-Z])/g,"_$1").toLowerCase();
}

module.exports = modify;