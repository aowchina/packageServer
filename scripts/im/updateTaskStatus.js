var program = require("commander");
var process = require("process");
var build = require("../../app/model/build");
var logger = require("../../app/logger").logger;

program.version("1.0.0")
    .option("-t --taskId [type]", "task id for build")
    .option("-s --status [type]", "status for build  error or success")
    .parse(process.argv);
var taskId = program.taskId;
if(!taskId){
    errorHandler("taskId can can not be null");
}
var status = program.status;
if(!status){
    errorHandler("status can can not be null");
}

build.updateBuildStatus(taskId,status,(err)=>{
    if(err){
        errorHandler(err);
    }else{
        logger.info("update status :"+status);
        process.exit(0);
    }
});

function errorHandler(err){
    logger.error(err);
    process.exit(-1);
}
