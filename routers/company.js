
var router = require("express").Router();
var company = require("../model/company");

//查看公司列表
router.get("/company",(req,res)=>{
    var username = req.cookies.username;
    company.getCompanys(username,(err,companys)=>{
        if(err){
            res.redirect("/error/"+err.errorInfo);
        }else{
            res.render("company.ejs",{companys:companys});
        }
    });
});

//创建公司
router.get("/company/create",(req,res)=>{
    res.render("company_create.ejs");
});

router.post("/company/create",(req,res)=>{
    var body = req.body;
    company.addCompany(body.companyId,body.companyName,(err)=>{
        if(err){
            res.redirect("/error/"+err.errorInfo);
        }else{
            res.redirect("/company");
        }
    });
});

router.get("/company/detail/:companyId",(req,res)=>{
    var companyId = req.params.companyId;
    company.getCompany(companyId,(err,com)=>{
        if(err){
            res.redirect("/error/"+err.errorInfo);
        }else{
            res.render("company_detail.ejs",{company:com});
        }
    });
});

module.exports = router;