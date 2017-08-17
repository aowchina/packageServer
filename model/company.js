var query = require("../data/mysqlHelper");

var SQL = {
    insert:"insert into company(companyId,companyName) values(?,?)"
};

export function addCompany(companyId,companyName){
    query(SQL.insert,[companyId,companyName],()=>{
        
    });
}
