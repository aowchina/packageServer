var company = require("../data/company");
var error = require("./error");
var async = require("async");

exports.addCompany = function(companyId,companyName,callback){
    async.waterfall(
        [
            (_cb)=>{
                company.existsCompany(companyId,_cb);
            },
            (_result,_cb)=>{
                if(_result){
                    _cb(error(error.code.CompanyDuplicate));
                }else{
                    _cb(null);
                }
            },
            (_cb)=>{
                company.addCompany(companyId,companyName,_cb);
            }
        ],
        (err)=>{
            callback(err);
        }
    );
};

exports.existsCompany = function(companyId,callback){
    company.existsCompany(companyId,callback);
};

exports.getCompanys = function(username,callback){
    company.getCompanys(username,callback);
};

exports.getCompany = function(companyId,callback){
    company.getCompany(companyId,callback);
};

