"use strict";
(function (LogLevel) {
    LogLevel[LogLevel["ALL"] = -2147483648] = "ALL";
    LogLevel[LogLevel["TRACE"] = 1000] = "TRACE";
    LogLevel[LogLevel["DEBUG"] = 2000] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 3000] = "INFO";
    LogLevel[LogLevel["WARN"] = 4000] = "WARN";
    LogLevel[LogLevel["ERROR"] = 5000] = "ERROR";
    LogLevel[LogLevel["FATAL"] = 6000] = "FATAL";
    LogLevel[LogLevel["OFF"] = 2147483647] = "OFF";
})(exports.LogLevel || (exports.LogLevel = {}));
var LogLevel = exports.LogLevel;
var Config = (function () {
    function Config() {
    }
    Config.APPLICATION_NAME = "";
    Config.DEBUG = true;
    Config.LOG_LEVEL = LogLevel.DEBUG;
    Config.LOG_TO_SERVER = false;
    Config.LOG_TO_CONSOLE = true;
    Config.STAGE_WIDTH = 1280;
    Config.STAGE_HEIGHT = 720;
    Config.BG_COLOR = 0x6495ED;
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=config.js.map