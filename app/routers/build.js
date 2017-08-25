var router = require("express").Router();
var async = require("async");
var build = require("../model/build");
var util = require("util");
var company = require("../model/company");

router.get("/build/form/:type/:companyId", (req, res) => {
    var type = req.params.type;
    var companyId = req.params.companyId;
    var _company = null;
    async.waterfall(
        [
            (_cb) => {
                build.checkStatus(companyId, type, _cb);
            },
            (_cb) => {
                company.getCompany(companyId, _cb);
            },
            (_data, _cb) => {
                _company = _data;
                build.lastBuild(companyId, type, _cb);
            }
        ],
        (err, _lastBuild) => {
            if (err) {
                res.redirect("/error/" + err.errorInfo);
            } else {
                res.render("build_" + type + ".ejs", { company: _company, lastBuild: _lastBuild ? _lastBuild : {} });
            }
        }
    );
});

router.post("/build/:type/:companyId", (req, res) => {
    var type = req.params.type;
    var companyId = req.params.companyId;
    var body = req.body;
    build.build(companyId, type, body, (err, data) => {
        if (err) {
            res.redirect("/error/" + err.errorInfo);
        } else {
            var path = util.format("/build/detail/%s/%s", type, data.taskId);
            res.redirect(path);
        }
    });
});

router.get("/build/history/:type/:companyId", (req, res) => {
    var type = req.params.type;
    var companyId = req.params.companyId;
    build.getBuildHistory(companyId, type, (err, builds) => {
        if (err) {
            res.redirect("/error/" + err.errorInfo);
        } else {
            res.render("build_history.ejs", { builds: builds });
        }
    });
});

router.get("/build/detail/:type/:taskId", (req, res) => {
    var taskId = req.params.taskId;
    build.getBuildWithTaskId(taskId, (err, _build) => {
        if (err) {
            res.redirect("/error/" + err.errorInfo);
        } else {
            res.render("build_detail.ejs", { build: _build });
        }
    });
});

router.get("/build/stop/:type/:taskId", (req, res) => {
    var taskId = req.params.taskId;
    var type = req.params.type;
    build.stopBuild(taskId, (err) => {
        if (err) {
            res.redirect("/error/" + err.errorInfo);
        } else {
            var path = util.format("/build/detail/%s/%s", type, taskId);
            res.redirect(path);
        }
    });
});

router.get("/build/delete/:type/:taskId", (req, res) => {
    var taskId = req.params.taskId;
    var type = req.params.type;
    var companyId = "";
    async.waterfall(
        [
            (_cb) => {
                build.getBuildWithTaskId(taskId, _cb);
            },
            (_build, _cb) => {
                companyId = _build.companyId;
                _cb();
            },
            (_cb)=>{
                build.deleteBuild(taskId,_cb);
            }
        ],
        (err) => {
            if (err) {
                res.redirect("/error/" + err.errorInfo);
            } else {
                var path = util.format("/build/form/%s/%s", type, companyId);
                res.redirect(path);
            }
        }
    );
});

module.exports = router;