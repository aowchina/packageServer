var formidable = require("formidable");
var fs = require('fs-extra');
var logger = require("../logger").logger;
var util = require("util");

module.exports = function (req, callback) {
    var form = new formidable.IncomingForm();
    form.encoding = "utf-8";
    form.keepExtensions = true;
    //设置单文件大小限制20M
    form.maxFieldsSize = 20 * 1024 * 1024;
    //设置临时文件存放路径
    var uploadDir = __dirname + "/upload";
    var posts = {};
    var files = [];
    var fileCount = 0;
    if (fs.ensureDirSync(uploadDir)) {
        logger.info("Created directory " + uploadDir);
    }
    form.uploadDir = uploadDir;
    form.on("error", (err) => {
        callback(err);
    }).on("field", (field, value) => {
        if (form.type == "multipart") { //有文件上传时 enctype="multipart/form-data" 
            if (field in posts) { //同名表单 checkbox 返回array
                if (util.isArray(posts[field]) === false) {
                    posts[field] = [posts[field]];
                }
                posts[field].push(value);
                return;
            }
            posts[field] = value;
        }
        posts[field] = value;
    }).on("file", function(field, file) { //上传文件
        files[fileCount++] = file;
    }).on("end", function() {
        callback(null,posts,files);
    });

    form.parse(req);
};