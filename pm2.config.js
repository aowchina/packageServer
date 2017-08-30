module.exports = {
    apps: [{
        name: "app",
        script: "./app/app.js",
        instances: 0,
        watch:true,
        exec_mode:"cluster"
    }]
};
