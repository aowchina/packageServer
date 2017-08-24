var fs = require("fs");
var path = require("path");
var _ = require("lodash");
// var process = require("process");
function modify(buildInfo,filepath,callback){
    try {
        var dir = __dirname;
        var fpath = path.join(dir,filepath);
        var conf = JSON.parse(fs.readFileSync(fpath, "utf8"));
        conf.company_id = buildInfo.companyId;
        var buildConfig = JSON.parse(buildInfo.buildConfig);
        _.forEach(buildConfig,(val,key)=>{
            var underline = convertCamelToUnderline(key);
            if(conf[underline]!=undefined){
                conf[underline] = val;
            }
        });
        fs.writeFileSync(fpath,JSON.stringify(conf,null,4),"utf8");
        callback(null);
    } catch (error) {
        callback(error);
    } 
}

function convertCamelToUnderline(camel){
    return camel.replace(/([A-Z])/g,"_$1").toLowerCase();
}

module.exports = modify;