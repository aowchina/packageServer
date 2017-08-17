var query = require("../data/mysqlHelper");
var util = require("util");

var SQL = {
    CREATE:"create table if not exists \
        company(\
        company_id varchar(64) NOT NULL PRIMARY KEY\
        ,compant_name text\
        )charset=utf8",
    INSERT:"insert into company(company_id,compant_name) values(?,?)",
    DELETE:"delete from company where company_id='%s'"
};

exports.addCompany = function(companyId,companyName,callback){
    query(SQL.INSERT,[companyId,companyName],(error)=>{
        callback(error);
    });
};

exports.deleteCompany = function(compantId,callback){
    query(util.format(SQL.DELETE,compantId),callback);
};

exports.initCompany = function (callback){
    query(SQL.CREATE,(error)=>{
        callback(error);
    });
};