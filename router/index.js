
var router = require("express").Router();

router.get("/",(req,res)=>{
    res.redirect("/welcome")
});

router.get("/welcome",(req,res)=>{
    res.render("welcome.ejs");
});

function createRouter(){
    return router;
}

module.exports = createRouter;