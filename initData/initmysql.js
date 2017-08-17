var logger = require("../logger").logger;
var company = require("../model/company");

company.initCompant((error) => {
    if (error) {
        logger.error(error);
    }
});

