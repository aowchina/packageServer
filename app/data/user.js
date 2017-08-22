
//用户系统
var query = require("../data/mysqlHelper");
var util = require("util");
var error = require("../model/error");
var dataBaseCheck = require("./dataBaseCheck");
var async = require("async");

var SQL = {
    CREATE:"create table if not exists \
        user(\
        username varchar(64) NOT NULL PRIMARY KEY\
        ,password varchar(64) NOT NULL\
        ,nickname varchar(64) NOT NULL\
        ,token varchar(64) default ''\
        ,expiredDate int default 0\
        )charset=utf8",
    INSERT:"insert into user(username,password,nickname) values (?,?,?)",
    UPDATE_TOKEN:"update user set token='%s',expiredDate=%d where username='%s'",
    SELECT_USER:"select * from user where username='%s'",
    EXIST_USER:"select (username) from user where username='%s'"
};

function user(){
    this.username = "";
    this.password = "";
    this.nickname = "";
}
exports.user = user;

exports.addUser = function (username,password,nickname,callback){
    async.waterfall([
        (_cb)=>{
            query(SQL.INSERT,[username,password,nickname],dataBaseCheck(_cb));
        },
    ],callback);
};

exports.setToken = function (username,token,expiredDate,callback){
    async.waterfall([
        (_cb)=>{
            query(util.format(SQL.UPDATE_TOKEN,token,expiredDate,username),dataBaseCheck(_cb));
        },
    ],callback);
};

exports.getUser = function(username,callback){
    async.waterfall([
        (_cb)=>{
            query(util.format(SQL.SELECT_USER,username),dataBaseCheck(_cb));
        },
        (_result,_cb)=>{
            if(_result.length==0){
                _cb(error(error.code.UserNotExists));
            }else{
                _cb(null,_result[0]);
            }
        }
    ],callback);
};

exports.existsUser = function(username,callback){
    async.waterfall(
        [
            (_cb)=>{
                query(util.format(SQL.EXIST_USER,username),_cb);
            },
            (_result,_cb)=>{
                _cb(null,_result.length!=0);
            }
        ],
        (err,exists)=>{
            callback(err,exists);
        }
    );
};

exports.initUser = function(callback){
    query(SQL.CREATE,dataBaseCheck(callback));
};
