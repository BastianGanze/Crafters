/// <reference path="../../libssrc/jsnlog.d.ts"/>
"use strict";
var config_1 = require("../config");
function Logger(loggerName) {
    var consoleAppender = JL.createConsoleAppender("ConsoleAppender");
    var serverAppender = JL.createAjaxAppender("ConsoleAppender");
    var appenders = [];
    if (config_1.Config.LOG_TO_CONSOLE)
        appenders.push(consoleAppender);
    if (config_1.Config.LOG_TO_SERVER)
        appenders.push(serverAppender);
    var logger = JL(loggerName).setOptions({ "appenders": appenders, level: config_1.Config.LOG_LEVEL });
    return logger;
}
exports.Logger = Logger;
exports.Log = Logger(config_1.Config.APPLICATION_NAME);
//# sourceMappingURL=Logger.js.map