module.exports = {
    apps: [{
        name: "app",
        script: "./app/app.js",
        instances: 0,
        exec_mode: "cluster"
    }]
};