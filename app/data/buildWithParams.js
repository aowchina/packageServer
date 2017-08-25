var error = require("../model/error");
var async = require("async");

var extractKeysMapping = {
    "ios":["branch","exportType","firToken","scheme","version","buildVersion"],
    "android":["branch","exportType","version","buildVersion","firToken"]
};

function extractParams(appType,taskId,buildConfig,callback){
    
    async.waterfall([
        (_cb)=>{
            var params = {};
            params.taskId = taskId;
            var keys = extractKeysMapping[appType];
            for(var i = 0;i<keys.length;i++){
                var k = keys[i];
                if(buildConfig[k]==undefined||buildConfig[k]==null){
                    return _cb(error(error.code.ExtractParamsError,"Missing field :"+k));
                }else{
                    params[k] = buildConfig[k];
                }
            }
            _cb(null,params);
        }
    ],callback);

}

module.exports = extractParams;