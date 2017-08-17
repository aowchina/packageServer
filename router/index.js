
var router = require("express").Router();
var welcome = require("./welcome");
var login = require("./login");
var main = require("./main");
var api = require("./api");

router.all("/main",require("./authenticatedUser")());
router.all("/api",require("./authenticatedUser")());

router.get("/",(req,res)=>{
    res.redirect("/welcome");
});

router.use(welcome);
router.use(login);
router.use(main);
router.all("/api/v1/",api);

function createRouter(){
    return router;
}

module.exports = createRouter;