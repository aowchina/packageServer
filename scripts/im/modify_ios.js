var modify_common = require("./modify_common");
var conf = require("./config");
var async = require("async");
var fs = require("fs");
var path = require("path");
var plist = require("plist");

function modify(buildInfo,callback){
    var buildConfig = JSON.parse(buildInfo.buildConfig);
    var scheme = buildConfig.scheme;
    var workspace = __dirname+"/files/";
    var imConf = conf[scheme];
    async.waterfall(
        [
            (_cb)=>{
                modify_common(buildInfo,path.join(workspace,conf.iosConfigPath),_cb);
            },
            (_cb)=>{
                modifyPlist(buildInfo,path.join(workspace,imConf.infoPlistPath),_cb);
            },
            (_cb)=>{
                modifyEntitlements(buildInfo,path.join(workspace,imConf.entitlementsPath),_cb);
            },
            (_cb)=>{
                modifySharePlist(buildInfo,path.join(workspace,imConf.shareGroupInfoPlistPath),_cb);
            },
            (_cb)=>{
                modifyEntitlements(buildInfo,path.join(workspace,imConf.shareGroupEntitlementsPath),_cb);
            }
        ],
        callback
    );
}  

function modifyPlist(buildInfo,fpath,callback){
    try {
        var conf = plist.parse(fs.readFileSync(fpath,"utf8"));
        var buildConfig = JSON.parse(buildInfo.buildConfig);
        conf["CFBundleName"] = buildConfig.appName;
        conf["CFBundleVersion"] = buildConfig.buildVersion;
        conf["CFBundleShortVersionString"] = buildConfig.version;
        conf["CFBundleIdentifier"] = buildConfig.bundleId;
        conf["CFBundleDisplayName"] = buildConfig.appName;
        var str = plist.build(conf);
        fs.writeFileSync(fpath,str,"utf8");
        callback(null);
    } catch (error) {
        callback(error);
    }
}

function modifySharePlist(buildInfo,fpath,callback){
    try {
        var conf = plist.parse(fs.readFileSync(fpath,"utf8"));
        var buildConfig = JSON.parse(buildInfo.buildConfig);
        conf["CFBundleName"] = buildConfig.appName;
        conf["CFBundleVersion"] = buildConfig.buildVersion;
        conf["CFBundleShortVersionString"] = buildConfig.version;
        conf["CFBundleIdentifier"] = buildConfig.shareGroupBundleId;
        conf["CFBundleDisplayName"] = buildConfig.appName;
        var str = plist.build(conf);
        fs.writeFileSync(fpath,str,"utf8");
        callback(null);
    } catch (error) {
        callback(error);
    }
}

function modifyEntitlements(buildInfo,fpath,callback){
    try {
        var conf = plist.parse(fs.readFileSync(fpath,"utf8"));
        var buildConfig = JSON.parse(buildInfo.buildConfig);
        conf["com.apple.security.application-groups"] = [buildConfig.shareGroupBundleId];
        var str = plist.build(conf);
        fs.writeFileSync(fpath,str,"utf8");
        callback(null);
    } catch (error) {
        callback(error);
    }
}

module.exports = modify;