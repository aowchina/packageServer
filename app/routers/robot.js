var router = require("express").Router();
var robot = require("../model/robot");
var formparse = require("../tools/formparse");
var config = require("../config/robot");
var async = require("async");
/**
 * 获取机器人列表
*/
router.get("/robot/list",(req,res)=>{
    var list = [];
    async.waterfall(
        [
            (_cb)=>{
                robot.getRobotList(config.testUrl,_cb);
            },
            (_data,_cb)=>{
                list = _data;
                _cb();
            }
        ],
        (err)=>{
            if(err){
                res.redirect("/error/"+err);
            }else{
                res.render("robot_list.ejs",{robots:list});
            }
        }
    );
});

/**
 * 创建机器人
*/
router.get("/robot/create",(req,res)=>{
    res.render("robot_create.ejs");
});

router.post("/robot/create",(req,res)=>{
    
    formparse(req,(err,body,files)=>{
        if(err){
            res.redirect("/error/"+err);
        }else{
            //TODO 提交图片
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

            var robotInfo = {
                baseInfo:{
                    nickName:body.nickName,
                    account:body.account,
                    intro:body.intro
                },
                serviceInfo:{
                    authType:body.authType,
                    authid:body.authid,
                    authInfo:body.authInfo,
                    followers:body.followers
                }
            };

            robot.createRobot(config.testUrl,robotInfo,(err)=>{
                if(err){
                    res.redirect("/error/"+err);
                }else{
                    res.redirect("/main");
                }
            });
        }
    });
});

/**
 * 查看服务号
*/
router.get("/robot/detail/:robotId",(req,res)=>{
    var robotId = req.params.robotId;
    robot.getRobotInfo(config.testUrl,robotId,(err,info)=>{
        if(err){
            res.redirect("/error/"+err);
        }else{
            res.render("robot_detail.ejs",{robot:info});
        }
    });
});


module.exports = router;