
var router = require("express").Router();
var welcome = require("./welcome");
var login = require("./login");
var main = require("./main");
var api = require("./api");
var company = require("./company");
var authenticatedUser = require("./authenticatedUser");
var build = require("./build");
var robot = require("./robot");

router.all("/main",authenticatedUser());
router.all("/api/*",authenticatedUser());
router.all("/company/*",authenticatedUser());
router.all("/build/*",authenticatedUser());
router.all("/robot/*",authenticatedUser());

router.get("/",(req,res)=>{
    res.redirect("/welcome");
});

router.use(welcome);
router.use(login);
router.use(main);
router.use(company);
router.use(build);
router.all("/api/v1/",api);
router.use(robot);


function createRouter(){
    return router;
}

module.exports = createRouter;