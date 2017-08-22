var router = require("express").Router();
var aynsc = require("async");
var build = require("../model/build");
var util = require("util");
var company = require("../model/company");

router.get("/build/form/:type/:companyId",(req,res)=>{
    var type = req.params.type;
    var companyId = req.params.companyId;
    aynsc.waterfall(
        [
            (_cb)=>{
                build.checkStatus(companyId,type,_cb);
            },
            (_cb)=>{
                company.getCompany(companyId,_cb);
            }
        ],
        (err,com)=>{
            if(err){
                res.redirect("/error/"+err.errorInfo);
            }else{
                res.render("build_"+type+".ejs",{company:com});
            }
        }
    );
});

router.post("/build/:type/:companyId",(req,res)=>{
    var type = req.params.type;
    var companyId = req.params.companyId;
    var body = req.body;
    build.build(companyId,type,body,(err,data)=>{
        if(err){
            res.redirect("/error/"+err.errorInfo);
        }else{
            var path = util.format("/build/detail/%s/%s",type,data.taskId);
            res.redirect(path);
        }
    });
});

router.get("/build/history/:type/:companyId",(req,res)=>{
    var type = req.params.type;
    var companyId = req.params.companyId;
    build.getBuildHistory(companyId,type,(err,builds)=>{
        if(err){
            res.redirect("/error/"+err.errorInfo);
        }else{
            res.render("build_history.ejs",{builds:builds});
        }
    });
});

router.get("/build/detail/:type/:taskId",(req,res)=>{
    var taskId = req.params.taskId;
    build.getBuildWithTaskId(taskId,(err,_build)=>{
        if(err){
            res.redirect("/error/"+err.errorInfo);
        }else{
            res.render("build_detail.ejs",{build:_build});
        }
    });
});

router.get("/build/stop/:type/:taskId",(req,res)=>{
    var taskId = req.params.taskId;
    var type = req.params.type;
    build.stopBuild(taskId,(err)=>{
        if(err){
            res.redirect("/error/"+err.errorInfo);
        }else{
            var path = util.format("/build/detail/%s/%s",type,taskId);
            res.redirect(path);
        }
    });
});

module.exports = router;