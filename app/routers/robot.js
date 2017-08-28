var router = require("express").Router();
var robot = require("../model/robot");
var async = require("async");
var config = require("../config/robot");
/**
 * 获取机器人列表
*/
router.get("/robot/list",(req,res)=>{
    
});

/**
 * 创建机器人
*/
router.get("/robot/create",(req,res)=>{
    res.render("robot_create.ejs");
});

router.post("/robot/create",(req,res)=>{
    var body = req.body;
    var isAll = parseInt(body.isAll);
    var companys = [];
    if(body.companys){
        companys = body.companys.split(",");
    }
    var users = [];
    if(body.users){
        users = body.users.split(",");
    }
    body.followers = JSON.stringify({isAll:isAll,companys:companys,users:users});
    robot.createRobot(config.testUrl,body,(err)=>{
        if(err){
            res.redirect("/error/"+err);
        }else{
            res.redirect("/main");
        }
    });

});



module.exports = router;