var request = require("request");
exports.getRobotList = function(url,callback){
    sendRequest(url,"backstage/robot/list",null,(err,body)=>{
        if(err){
            callback(err);
        }else{
            callback(null,body.robots);
        }
    });
};

exports.createRobot = function(url,robot,callback){
    sendRequest(url,"backstage/robot/create",robot,callback);
};

exports.getRobotInfo = function(url,robotId,callback){
    sendRequest(url,"backstage/robot/item",{robotId:robotId},callback);
};

function sendRequest(url,path,data,callback){
    if(data==null){
        data = {};
    }
    var sendData = {
        method:"POST",
        url:url+"/"+path,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data)
    };
    request(sendData,(err,res,stringBody)=>{
        if(err){
            callback(err);
        }else{
            var data = JSON.parse(stringBody);
            if(data.err){
                callback(data.err);
            }else{
                callback(err,data.body);
            }
        }
    });
}