var express = require("express");
express;
var user = require("../model/user");

function auth(){
    return (req,res,next)=>{
        if(req.cookies&&req.cookies.username&&req.cookies.token){
            user.validateToken(req.cookies.username,req.cookies.token,(err)=>{
                if(err){
                    res.redirect("/error/"+err.errorInfo);
                }else{
                    next();
                }
            });
        }else{
            res.redirect("/login");
        }
    };
}

module.exports = auth;