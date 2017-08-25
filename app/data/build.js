var query = require("../data/mysqlHelper");
var util = require("util");
var databaseCheck = require("./databaseCheck");
var error = require("../model/error");
var jenkinsConfig = require("../config/jenkins");
var uuid = require("../model/uuid");
var async = require("async");
var buildWithParams = require("./buildWithParams");
var logger = require("../logger").logger;

var jenkinsHelper = new (require("./jenkinsHelper"))(jenkinsConfig.username,jenkinsConfig.token,jenkinsConfig.password,jenkinsConfig.host,jenkinsConfig.port);

var AppType = {
    iOS:"ios",
    Android:"android",
    Mac:"mac",
    Windows:"windows"
};

var BuildStatus = {
    Idle:"idel",
    Waiting:"waiting",
    Building:"building",
    Success:"success",
    Error:"error",
    Cancel:"cancel"
};

function BuildConfig (){
    this.appName = "";//app名字
    this.version = "";//版本号
    this.buildVersion = "";//小版本号
    this.bundleId = "";//appId
}

function Build(){
    this.id = 0;
    this.taskId = "";
    this.appType = "";
    this.appName = "";
    this.companyId = "";
    this.version = "";
    this.buildVersion = "";
    this.buildConfig = "";
    this.bundleId = "";
    this.status = "";
    this.queueId = 0;
    this.startTimestamp = 0;
}

var Job_iOS = "im-ios";
var Job_Android = "im-android";

var JobMapping = {
    "ios":Job_iOS,
    "android":Job_Android
};

var SQL = {
    CREATE:" create table if not exists \
    build(\
    id int auto_increment primary key,\
    taskId varchar(64) not null,\
    appType varchar(32) not null,\
    appName varchar(128) not null,\
    companyId varchar(64) not null,\
    version varchar(64) not null,\
    buildVersion varchar(64) not null,\
    bundleId varchar(64) not null,\
    buildConfig varchar(10000) not null,\
    status varchar(64) ,\
    queueId int default 0,\
    startTimestamp int default 0 \
    )charset=utf8",
    INSERT:"insert into build(taskId,appType,appName,companyId,version,buildVersion,bundleId,buildConfig,status,queueId,startTimestamp) values (?,?,?,?,?,?,?,?,?,?,?)",
    UPDATE_QUEUE_ID:"update build set queueId=%d,status='%s' where taskId='%s' ",
    UPDATE_STATUS:"update build set status='%s' where taskId='%s' ",
    SELECT:"select * from build where companyId='%s' and appType='%s' and status in('%s','%s')",
    SELECT_TASKID:"select * from build where taskId='%s'",
    SELECT_ALL_TYPE:"select * from build where companyId='%s' and appType='%s' order by id desc",
    SELECT_LAST:"select * from build where companyId='%s' and appType='%s' order by id desc limit 1 ",
    DELETE_BUILD:"delete from build where taskId='%s'"
};

exports.appType = AppType;
exports.buildStatus = BuildStatus;
exports.BuildConfig = BuildConfig;
exports.Build = Build;

exports.buildApp = function(companyId,appType,buildConfig,callback){
    var taskId = uuid();
    var data = [taskId,appType,buildConfig.appName,companyId,buildConfig.version,buildConfig.buildVersion,buildConfig.bundleId,JSON.stringify(buildConfig),BuildStatus.Waiting,0,parseInt(Date.now()/1000)];
    query(SQL.INSERT,data,databaseCheck((err=>{
        if(err){
            callback(err);
        }else{
            buildWithParams(appType,taskId,buildConfig,(err,params)=>{
                if(err){
                    return callback(err);
                }
                jenkinsHelper.build(JobMapping[appType],params,(err,result)=>{
                    if(err){
                        updateQueueIdAndStatus(taskId,0,BuildStatus.Error,callback);
                    }else{
                        updateQueueIdAndStatus(taskId,result.queueId,BuildStatus.Waiting,callback);
                    }
                });
            });
            
        }
    })));
};



function updateQueueIdAndStatus(taskId,queueId,status,callback){
    var sql = util.format(SQL.UPDATE_QUEUE_ID,queueId,status,taskId);
    query(sql,databaseCheck((err)=>{
        if(err){
            callback(err);
        }else{
            callback(null,{taskId:taskId,queueId:queueId});
        }
    }));
}

exports.updateQueueIdAndStatus = updateQueueIdAndStatus;

/**
 * 获取打包状态 闲置 或者等待 
*/
exports.checkBuildStatus = function(companyId,appType,callback){
    getBuilding(companyId,appType,(err,build)=>{
        if(err){
            callback(err);
        }else{
            if(!build){
                callback(null,BuildStatus.Idle);
            }else{
                callback(null,build.status);
            }
        }
    });
};
exports.getBuilding = getBuilding;
/**
 * 获取正在打包的build
*/
function getBuilding(companyId,appType,callback){
    var sql = util.format(SQL.SELECT,companyId,appType,BuildStatus.Waiting,BuildStatus.Building);
    query(sql,databaseCheck((err,result)=>{
        if(err){
            callback(err);
        }else{
            if(result.length>0){
                callback(null,result[0]);
            }else{
                callback(null,null);
            }
        }
    }));
}

/**
 * 最近的一次打包
*/
function lastBuild(companyId,appType,callback){
    var sql = util.format(SQL.SELECT_LAST,companyId,appType);
    query(sql,databaseCheck((err,result)=>{
        if(err){
            callback(err);
        }else{
            if(result.length>0){
                callback(null,result[0]);
            }else{
                callback(null,null);
            }
        }
    }));
}

exports.lastBuild = lastBuild;



function getBuildInfo(appType,queueId,callback){
    jenkinsHelper.buildInfo(JobMapping[appType],queueId,callback);
}

exports.getBuildInfo = getBuildInfo;

/**
 * 获取build
*/
function getBuildWithTaskId(taskId,callback){
    var sql = util.format(SQL.SELECT_TASKID,taskId);
    query(sql,databaseCheck((err,result)=>{
        if(err){
            callback(err);
        }else{
            if(result.length>0){
                callback(null,result[0]);
            }else{
                callback(null,null);
            }
        }
    }));
}

exports.getBuildWithTaskId = getBuildWithTaskId;
/**
 * 获取公司所有build的记录
*/
exports.getAllBuilds = function(companyId,appType,callback) {
    var sql = util.format(SQL.SELECT_ALL_TYPE,companyId,appType);
    query(sql,databaseCheck(callback));
};

/**
 * 取消打包
*/

function stopBuild(taskId,callback){
    var _buildData = null;
    async.waterfall(
        [
            (_cb)=>{
                getBuildWithTaskId(taskId,_cb);
            },
            (_build,_cb)=>{
                if(_build){
                    _buildData = _build;
                    jenkinsHelper.stopBuild(JobMapping[_build.appType],_build.queueId,(err=>{
                        _cb(err);
                    }));
                }else{
                    _cb(error(error.code.BuildingNotExists));
                }
            },
            (_cb)=>{
                updateQueueIdAndStatus(_buildData.taskId,_buildData.queueId,BuildStatus.Cancel,_cb);
            }
        ],
        callback
    );
    
}

exports.stopBuild = stopBuild;

exports.deleteBuild = function(taskId,callback){
    stopBuild(taskId,(err)=>{
        if(err){
            logger.error(err);
        }
    });
    var sql = util.format(SQL.DELETE_BUILD,taskId);
    query(sql,callback);
};

exports.updateBuildStatus = function(taskId,status,callback){
    var sql = util.format(SQL.UPDATE_STATUS,status,taskId);
    query(sql,callback);
};

exports.initBuild = function(callback) {
    query(SQL.CREATE,callback);
};

