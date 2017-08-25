var program = require("commander");
var process = require("process");
var logger = require("../../app/logger").logger;
var build = require("../../app/model/build");
var async = require("async");
var path =  require("path");
var fs = require("fs");

program.version("1.0.0")
    .option("-t --taskId [type]", "task id for build")
    .option("-w --workplace [type]", "workplace  for android")
    .parse(process.argv);


var taskId = program.taskId;
if(!taskId){
    errorHandler("taskId can not be null");
}
var workplace = program.workplace;
if(!workplace){
    errorHandler("workplace can not be null");
}

var defaultAppName = {
    debug:"app-develop-debug.apk",
    release:"app-product-release.apk",
};

var apkDir = "app/build/outputs/apk/";
var rename = "";
async.waterfall(
    [
        (_cb)=>{
            build.getBuildWithTaskId(taskId,_cb);
        },
        (_build,_cb)=>{
            var date = new Date();
            var fileNewName = [buildConfig.exportType,date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()].join("-")+".apk";

            var buildConfig = JSON.parse(_build.buildConfig);
            var fpath = path.join(workplace,apkDir,defaultAppName[buildConfig.exportType]);
            rename  = path.join(workplace,apkDir,fileNewName);
            fs.rename(fpath,rename,_cb);
        }
    ]
    ,
    (err)=>{
        if(err){
            errorHandler(err);
        }else{
            logger.info("modify appName success and upload fir success");
            process.exit(0);
        }
    }
);


function errorHandler(err){
    logger.error(err);
    process.exit(-1);
}