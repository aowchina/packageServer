//修改config脚本
var program = require("commander");
var process = require("process");
var build = require("../../app/model/build");
var async = require("async");
var logger = require("../../app/logger").logger;
var modify_ios = require("./modify_ios");
var modify_android = require("./modify_android");

program.version("1.0.0").option("-t","--taskId","task id for build").parse(process.argv);
var taskId = program.taskId;
taskId = "cc99e9c087ec11e79433bf0b1f184102";

var funcMapping = {
    "ios":modify_android,
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
            logger.error(err);
            process.exit(-1);
        }else{
            var func = funcMapping[_build.appType];
            
            func(_build,(err)=>{
                if(err){
                    logger.error(err);
                    process.exit(-1);
                }else{
                    logger.info("modify conf success");
                    process.exit(0);
                }
            });
        } 
    }
);




