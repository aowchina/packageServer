var express = require("express");
express;
var account = require("../config/account");

function auth(){
    return (req,res,next)=>{
        if(req.cookies&&req.cookies.token==account.token){
            next();
        }else{
            res.redirect("/login");
        }
    };
}

module.exports = auth;