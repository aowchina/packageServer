var request = require("request");
var util = require("util");
var _ = require("lodash");
var jenkinsapi = require("jenkins-api");
var logger = require("../logger").logger;
var error = require("../model/error");

function jenkins(user, token,password, host, port) {
    this.user = user;
    this.token = token;
    this.host = host;
    this.port;
    this.password = password;
    this.url = util.format("http://%s:%s@%s:%s",user,password, host, port);
    this.jenkinsapi = jenkinsapi.init(this.url);
}

jenkins.prototype.build = function (job, params, callback) {
    this.jenkinsapi.build_with_params(job,params,(err,data)=>{
        if(err){
            logger.error(err);
            callback(error(error.code.JenkinsError,err));
        }else{
            callback(err,data);
        }
    });
};

jenkins.prototype.buildInfo = function(job,queueId,callback){
    this.jenkinsapi.build_info(job,queueId,(err,data)=>{
        if(err){
            logger.error(err);
            callback(error(error.code.JenkinsError,err));
        }else{
            callback(err,data);
        }
    });
};

jenkins.prototype.stopBuild = function(job,queueId,callback){
    this.jenkinsapi.stop_build(job,queueId,(err,data)=>{
        if(err){
            logger.error(err);
            callback(error(error.code.JenkinsError,err));
        }else{
            callback(err,data);
        }
    });
};

module.exports = jenkins;