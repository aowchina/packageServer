const router = require("express").Router();
const account = require("../config/account");

router.get("/login",(req,res)=>{
    res.render("login.ejs");
});

router.post("/userLogin",(req,res)=>{
    var body = req.body;
    if(body.username==account.username&&body.password==account.password){
        res.cookie("token",account.token,{ maxAge: 900000, httpOnly: true });
        res.redirect("/main");
    }else{
        res.redirect("/error/"+"密码错误");
    }
});

router.get("/error/:errorInfo",(req,res)=>{
    res.render("error.ejs",{error:req.params.errorInfo});
});

module.exports = router;