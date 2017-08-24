var build = require("../data/build");
var async = require("async");
var error = require("./error");
var _ = require("lodash");

var numberConvertKeys = [
    "loginType",
    "registerSupport",
    "changePwSupport",
    "modifyUserInfoSupport",
    "cloudTableLoginSupport",
    "itunesScoreSupport"
];

function convertConfig (config){
    var params = {};
    _.forEach(config,(val,key)=>{
        if(numberConvertKeys.indexOf(key)>=0&&!isNaN(Number(val))){
            params[key] = Number(val);
        }else{
            params[key] = val;
        }
    });
    return params;
}
exports.build = function (companyId,appType,config,callback){
    async.waterfall(
        [
            (_cb)=>{
                checkStatus(companyId,appType,_cb);
            },
            (_cb)=>{
                build.buildApp(companyId,appType,convertConfig(config),_cb);
            }
        ],
        callback
    );
};

exports.buildStatus = function(companyId,appType,callback){
    build.lastBuild(companyId,appType,callback);
};

exports.lastBuild = function(companyId,appType,callback){
    build.lastBuild(companyId,appType,callback);
};

function checkStatus(companyId,appType,callback){
    build.lastBuild(companyId,appType,(err,_build)=>{
        if(_build&&(_build.status==build.buildStatus.Waiting||_build.status==build.buildStatus.Building)){
            callback(error(error.code.BuildingExists));
        }else{
            callback(null);
        }
    });
}
exports.checkStatus = checkStatus;

exports.getBuildHistory = function(companyId,appType,callback){
    build.getAllBuilds(companyId,appType,callback);
};

exports.getBuildWithTaskId = function(taskId,callback){
    build.getBuildWithTaskId(taskId,callback);
};

exports.stopBuild = function (taskId,callback){
    build.stopBuild(taskId,callback);
};
