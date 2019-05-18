var Shell = /** @class */ (function () {
    function Shell(server) {
        this.server = server;
    }
    /**
     * shell 命令
     * @param cmdargs 命令参数
     * @param timeout 超时时间
     */
    Shell.prototype.shell = function (cmdargs, timeout) {
        if (timeout === void 0) { timeout = 60; }
        return this.server.shell(cmdargs, timeout);
    };
    ;
    /**
     * 执行 shell 命令
     * @param args 命令参数
     */
    Shell.prototype.adb_shell = function (args) {
        return this.server.adb_shell(args);
    };
    ;
    return Shell;
}());
exports.Shell = Shell;
