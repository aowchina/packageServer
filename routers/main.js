const router = require("express").Router();

router.get("/main",(req,res)=>{
    res.render("main.ejs");
});

module.exports = router;