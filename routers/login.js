const router = require("express").Router();
const user = require("../model/user");
const async = require("async");

router.get("/login", (req, res) => {
    res.render("login.ejs");
});

router.get("/logout", (req, res) => {
    var username = req.cookies.username;
    if(username){
        user.clearToken(username,()=>{
            res.clearCookie("token");
            res.clearCookie("username");
            res.redirect("/login");
        });
    }else{
        res.redirect("/login");
    }
});

router.post("/userLogin", (req, res) => {
    var body = req.body;
    async.waterfall(
        [
            (_cb)=>{
                user.checkPassword(body.username,body.password,_cb);
            },
            (_cb)=>{
                user.updateToken(body.username,_cb);
            }
        ],
        (_error,_data) => {
            if(_error){
                res.redirect("/error/" + _error.errorInfo);
            }else{
                res.cookie("token",_data.token,{ expires: new Date(_data.expiredDate*1000), httpOnly: true });
                res.cookie("username",body.username,{ expires: new Date(_data.expiredDate*1000), httpOnly: true });
                res.redirect("/main");
            }
        }
    );
});

router.get("/error/:errorInfo", (req, res) => {
    res.render("error.ejs", { error: req.params.errorInfo });
});

module.exports = router;