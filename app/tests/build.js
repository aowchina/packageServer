var build = require("../model/build");
var buildDB = require("../data/build");
var logger = require("../logger").logger;
var process = require("process");
var async = require("async");

// var config = new build.BuildConfig();
var config = {};
config.appName = "伙伴畅聊";
config.version = "1.0.0";
config.buildVersion = "1";
config.bundleId = "com.tongren.im";

async.waterfall(
    [
        (_cb)=>{
            build.build("1",buildDB.appType.iOS,config,_cb);
        },
        (_cb)=>{
            build.getBuildHistory("1",buildDB.appType.iOS,_cb);
        },
        (_data,_cb)=>{
            build.lastBuild("1",build.buildDB.iOS,_cb);
        }
    ]
    ,
    (err,_build)=>{
        if(err){
            logger.error(err.errorInfo);
            process.exit(-1);
        }else{
            logger.info(_build);
            process.exit(0);
        }
    }
);