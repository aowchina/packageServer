var conf = {
    appenders: {
        app: {
            type: "file",
            filename: "./log/app.log",
            maxLogSize: 10485760,
            backups: 9,
            layout:
            {
                type: "pattern",
                pattern: "[%d] %p %m"
            }
        },
        console: {
            type: "console",
        }
    },
    categories: {
        default: {
            appenders: ["app", "console"],
            level: "debug"
        },
        app: {
            appenders: ["app", "console"],
            level: "debug"
        }
    }
};

module.exports = conf;