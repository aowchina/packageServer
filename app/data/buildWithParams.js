var error = require("../model/error");
var async = require("async");

var extractKeysMapping = {
    "ios":["branch","exportType","taskId","scheme"],
    "android":["branch","taskId"]
};

function extractParams(appType,buildConfig,callback){
    
    async.waterfall([
        (_cb)=>{
            var params = {};
            var keys = extractKeysMapping[appType];
            for(var i = 0;i<keys.length;i++){
                var k = keys[i];
                if(buildConfig[k]==undefined||buildConfig[k]==null){
                    return _cb(error(error.code.ExtractParamsError,"Missing field :"+k));
                }else{
                    params[k] = buildConfig[k];
                }
            }
            _cb();
        }
    ],callback);

}

module.exports = extractParams;