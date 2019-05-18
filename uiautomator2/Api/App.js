var App = /** @class */ (function () {
    function App(server) {
        this.server = server;
    }
    /**
     * 获取设备名称
     * @constructor
     */
    App.prototype.Serial = function () {
        return this.server.Serial();
    };
    /**
     * 设备信息
     * @private
     */
    App.prototype.DeviceInfo = function () {
        return this.server.DeviceInfo();
    };
    /**
     * 获得窗口大小
     * @constructor
     */
    App.prototype.WindowSize = function () {
        return this.server.WindowSize();
    };
    ;
    /**
     * 启动app
     * @param pkgName  包名
     * @param activity activity
     * @param wait  是否等待
     * @param stop  是否在启动app之前停止应用。 （要求传入activity）
     * @param unlock 是否解锁屏幕
     * @constructor
     */
    App.prototype.AppStart = function (pkgName, activity, wait, stop, unlock) {
        if (activity === void 0) { activity = null; }
        if (wait === void 0) { wait = true; }
        if (stop === void 0) { stop = false; }
        if (unlock === void 0) { unlock = false; }
        return this.server.AppStart(pkgName, activity, wait, stop, unlock);
    };
    /**
     * 获得当前app的信息
     * @constructor
     */
    App.prototype.CurrentApp = function () {
        return this.server.CurrentApp();
    };
    /**
     * 等待 activity出现或消失
     * @param activity 等待的activity
     * @param timeout 超时时间
     * @constructor
     */
    App.prototype.WaitActivity = function (activity, timeout) {
        if (timeout === void 0) { timeout = 10; }
        return this.server.WaitActivity(activity, timeout);
    };
    /**
     * 关闭app
     * @param pkg_name 包名
     * @constructor
     */
    App.prototype.AppStop = function (pkg_name) {
        return this.server.AppStop(pkg_name);
    };
    /**
     * 停止所有app
     * @param excludes 要停止的app集合
     * @constructor
     */
    App.prototype.AppStopAll = function (excludes) {
        if (excludes === void 0) { excludes = new Array(); }
        return this.server.AppStopAll(excludes);
    };
    /**
     * 停止并清除应用数据：pm清除
     * @param pkg_name 包名
     * @constructor
     */
    App.prototype.AppClear = function (pkg_name) {
        return this.server.AppClear(pkg_name);
    };
    ;
    /**
     * 卸载app
     * @param pkg_name 包名
     * @constructor
     */
    App.prototype.AppUninstall = function (pkg_name) {
        return this.server.AppUninstall(pkg_name);
    };
    ;
    /**
     * 卸载所有app
     * @param excludes 要卸载的包名
     * @constructor
     */
    App.prototype.AppUninstallAll = function (excludes) {
        if (excludes === void 0) { excludes = new Array(); }
        return this.server.AppUninstallAll(excludes);
    };
    ;
    /**
     * 解锁屏幕
     * @constructor
     */
    App.prototype.Unlock = function () {
        return this.server.Unlock();
    };
    ;
    /**
     * app信息
     * @param pkg_name 包名
     * @constructor
     */
    App.prototype.AppInfo = function (pkg_name) {
        return this.server.AppInfo(pkg_name);
    };
    ;
    return App;
}());
exports.App = App;
