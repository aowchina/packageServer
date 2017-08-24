var modify_common = require("./modify_common");
var conf = require("./config");
var async = require("async");
var fs = require("fs");
var path = require("path");
var plist = require("plist");

function modify(buildInfo,callback){
    
    async.waterfall(
        [
            (_cb)=>{
                modify_common(buildInfo,conf.iosConfigPath,_cb);
            },
            (_cb)=>{
                modifyPlist(buildInfo,conf.iosInfoPlistPath,_cb);
            }
        ],
        callback
    );
}  

function modifyPlist(buildInfo,filepath,callback){
    try {
        var fpath = path.join(__dirname,filepath);
        var conf = plist.parse(fs.readFileSync(fpath,"utf8"));
        var buildConfig = JSON.parse(buildInfo.buildConfig);
        conf["CFBundleName"] = buildConfig.appName;
        conf["CFBundleVersion"] = buildConfig.buildVersion;
        conf["CFBundleShortVersionString"] = buildConfig.version;
        conf["CFBundleIdentifier"] = buildConfig.bundleId;
        var str = plist.build(conf);
        fs.writeFileSync(fpath,str,"utf8");
        callback(null);
    } catch (error) {
        callback(error);
    }
}

module.exports = modify;