var request = require("request");
exports.getRobotList = function(url,callback){
    sendRequest(url,"backstage/robot/list",null,callback);
};

exports.createRobot = function(url,robot,callback){
    sendRequest(url,"backstage/robot/create",robot,callback);
};

function sendRequest(url,path,data,callback){
    var sendData = {
        method:"POST",
        url:url+"/"+path,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data)
    };
    request(sendData,(err,res,body)=>{
        callback(err,body);
    });
}