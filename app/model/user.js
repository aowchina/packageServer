
var user = require("../data/user");
var error = require("./error");
var userConfig = require("../config/account");
var uuid = require("./uuid");
var async = require("async");

exports.validateToken = function(username,token,callback){
    user.getUser(username,(err,user)=>{
        if(err){
            callback(err);
        }else{
            if(user.token==token&&Date.now()/1000 < user.expiredDate){
                callback(null);
            }else{
                callback(error(error.code.TokenExpired));
            }
        }
    });
};

exports.checkPassword = function(username,password,callback){
    user.getUser(username,(err,user)=>{
        if(err){
            callback(err);
        }else{
            if(user.password==password){
                callback(null);
            }else{
                callback(error(error.code.PasswordWrong));
            }
        }
    });
};

exports.updateToken = function(username,callback){
    var token = uuid();
    var expiredDate = parseInt(Date.now()/1000 + userConfig.tokenKeepTime);
    user.setToken(username,token,expiredDate,(err)=>{
        if(err){
            callback(err);
        }else{
            callback(null,{token:token,expiredDate:expiredDate});
        }
    });
};

exports.addUser = function(username,password,nickname,callback){
    async.waterfall(
        [
            (_cb)=>{
                user.existsUser(username,_cb);
            },
            (_exists,_cb)=>{
                if(!_exists){
                    user.addUser(username,password,nickname,_cb);
                }else{
                    _cb(null);
                }
            }
        ],
        (err)=>{
            callback(err);
        }
    );
};

exports.clearToken = function(username,callback){
    user.setToken(username,"",0,(err)=>{
        if(err){
            callback(err);
        }else{
            callback(null);
        }
    });
};