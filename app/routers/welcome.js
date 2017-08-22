const router = require("express").Router();
router.get("/welcome",(req,res)=>{
    res.render("welcome.ejs",{welcome:"welcome"});
});

module.exports = router;