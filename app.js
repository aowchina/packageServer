var express = require("express");
var app = express();
var router = require("./router");
var logger = require('./logger').logger;
var log4js = require('./logger').log4js;

var conf = require('./config/server.js');
app.set("viewengine",'ejs');
app.set("views",__dirname+"/views")
app.use(express.static(__dirname));

app.use(log4js.connectLogger(logger, { level: "auto" }));
app.use(router());

app.listen(conf.port,(err)=>{
    if(err){
        logger.error("app server start error ,port :",conf.port," error info:",err);
    }else{
        logger.info("app server start success ,port :",conf.port);
    }
});

