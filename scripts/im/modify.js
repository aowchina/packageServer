//修改config脚本
var program = require("commander");
var process = require("process");
var build = require("../../app/model/build");
var async = require("async");
var logger = require("../../app/logger").logger;
var modify_ios = require("./modify_ios");
var modify_android = require("./modify_android");

program.version("1.0.0")
    .option("-t --taskId [type]","task id for build")
    .option("-w --workspace [type]","workspace for job")
    .parse(process.argv);
    
var taskId = program.taskId;
// taskId = "28a72720895811e7a37a0b74f7dd6afc";
var workspace = program.workspace;
// workspace = "/Users/qizhang/Workplace/huoban/server/packageServer/scripts/im/files";
if(!taskId){
    errorHandler("taskId can not be null");
}

if(!workspace){
    errorHandler("workspace for job be not be null");
}

global.WORKSPACE = workspace;

logger.debug("taskId =",taskId);

var funcMapping = {
    "ios":modify_ios,
    "android":modify_android
};

async.waterfall(
    [
        (_cb)=>{
            if(taskId){
                build.getBuildWithTaskId(taskId,_cb);
            }else{
                _cb("taskId can not be null");
            }
        },
        (_build,_cb)=>{
            if(!_build){
                _cb("build info can not found");
            }else{
                _cb(null,_build);
            }
        }
    ],
    (err,_build)=>{
        if(err){
            errorHandler(err);
        }else{
            var func = funcMapping[_build.appType];
            
            func(_build,(err)=>{
                if(err){
                    errorHandler(err);
                }else{
                    logger.info("modify conf success");
                    process.exit(0);
                }
            });
        } 
    }
);

function errorHandler(err){
    logger.error(err);
    process.exit(-1);
}


