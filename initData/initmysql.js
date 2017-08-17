var query = require("../data/mysqlHelper");
var logger = require("../logger").logger;
var SQL = {
    CREATE_COMPANY:"create table if not exists \
        company(\
        company_uid varchar(64) NOT NULL PRIMARY KEY\
        ,compant_name text\
        )"
};

query(SQL.CREATE_COMPANY,(err)=>{
    if(err){
        logger.error("create company table error",err);
    }
});
