var query = require("../data/mysqlHelper");
var util = require("util");
var databaseCheck = require("./databaseCheck");
var error = require("../model/error");

var SQL = {
    CREATE:"create table if not exists \
        company(\
        companyId varchar(64) NOT NULL PRIMARY KEY\
        ,companyName text\
        )charset=utf8",
    INSERT:"insert into company(companyId,companyName) values(?,?)",
    DELETE:"delete from company where companyId='%s'",
    SELECT_COMPANY:"select * from company where companyId='%s'",
    SELECT_ALL:"select * from company",
    EXISTS_COMPANY:"select (companyId) from company where companyId='%s'",
};

function company(){
    this.companyId = "";
    this.companyName = "";
}

exports.company = company;

exports.addCompany = function(companyId,companyName,callback){
    if(companyId==""||companyName==""){
        return callback(error(error.code.ParamError));
    }
    query(SQL.INSERT,[companyId,companyName],databaseCheck(callback));
};

exports.getCompany = function(companyId,callback){
    query(util.format(SQL.SELECT_COMPANY,companyId),databaseCheck((err,result)=>{
        if(err){
            callback(err);
        }else{
            if(result.length==0){
                callback(error(error.code.CompanyNotExist));
            }else{
                callback(null,result[0]);
            }
        }
    }));
};

exports.existsCompany = function(companyId,callback){
    query(util.format(SQL.EXISTS_COMPANY,companyId),databaseCheck((err,result)=>{
        if(err){
            callback(err);
        }else{
            callback(null,result.length>0);
        }
    }));
};

exports.deleteCompany = function(compantId,callback){
    query(util.format(SQL.DELETE,compantId),databaseCheck(callback));
};

exports.initCompany = function (callback){
    query(SQL.CREATE,databaseCheck(callback));
};

exports.getCompanys = function(username,callback){
    query(SQL.SELECT_ALL,databaseCheck(callback));
};