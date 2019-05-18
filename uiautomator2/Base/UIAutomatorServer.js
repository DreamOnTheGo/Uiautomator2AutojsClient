var Session_1 = require("./Session");
var JSONRpcWrapper_1 = require("./JSONRpcWrapper");
var UIAutomatorServer = /** @class */ (function () {
    function UIAutomatorServer() {
        this.host = "127.0.0.1";
        this.port = 7912;
        this.__deviceInfo = null;
        this.serverUrl = "http://" + this.host + ":" + this.port;
        this.serverJsonRpcUrl = this.serverUrl + "/jsonrpc/0";
        this.waitTimeOut = 20;
        this.jsonrpc = this.SetupJsonRpc();
        this.ash = this.shell;
        this.ScreenshotUri = this.GetScreenshotUri();
        this.Session = new Session_1.Session(this);
    }
    UIAutomatorServer.prototype.GetScreenshotUri = function () {
        return "http://" + this.host + ":" + this.port + "/screenshot/0";
    };
    /**
     * 获取设备名称
     * @constructor
     */
    UIAutomatorServer.prototype.Serial = function () {
        return this.shell(['getprop', 'ro.serialno']).output.trim();
    };
    /**
     * 设备信息
     * @private
     */
    UIAutomatorServer.prototype.DeviceInfo = function () {
        if (this.__deviceInfo != null) {
            return this.__deviceInfo;
        }
        var url = this.path2url("/info");
        var r = http.get(url);
        var text = r.body.string();
        if (text.length <= 0) {
            return null;
        }
        this.__deviceInfo = JSON.parse(text);
        return this.__deviceInfo;
    };
    /**
     * 设置请求器
     * @param jsonrpcUrl 请求地址
     * @constructor
     */
    UIAutomatorServer.prototype.SetupJsonRpc = function (jsonrpcUrl) {
        if (jsonrpcUrl === void 0) { jsonrpcUrl = ""; }
        var url = this.serverJsonRpcUrl;
        if (jsonrpcUrl.length > 0) {
            url = jsonrpcUrl;
        }
        return new JSONRpcWrapper_1.JSONRpcWrapper(url);
    };
    ;
    /**
     * 设置 Session
     * @param pkgName 包名
     * @param pid 进程名
     * @constructor
     */
    UIAutomatorServer.prototype.SetSession = function (pkgName, pid) {
        this.Session = new Session_1.Session(this, pkgName, pid);
    };
    /**
     * 获得窗口大小
     * @constructor
     */
    UIAutomatorServer.prototype.WindowSize = function () {
        var url = this.path2url("/info");
        var r = http.get(url);
        var t = r.body.string();
        if (t.length <= 0)
            return null;
        var resp = JSON.parse(t);
        var display = resp.display;
        return { x: display.width, y: display.height };
    };
    ;
    /**
     * shell 命令
     * @param cmdargs 命令参数
     * @param timeout 超时时间
     */
    UIAutomatorServer.prototype.shell = function (cmdargs, timeout) {
        if (timeout === void 0) { timeout = 60; }
        var cmdline = cmdargs;
        if (cmdargs instanceof Array && cmdargs.length > 0) {
            cmdline = "";
            for (var i = 0; i < cmdargs.length; i++) {
                var item = cmdargs[i];
                cmdline += item + " ";
            }
        }
        var url = this.path2url("/shell");
        var r = http.post(url, {
            "command": cmdline,
            "timeout": timeout
        });
        var ret = r.body.string();
        if (ret.length <= 0)
            return null;
        var obj = JSON.parse(ret);
        return { "output": obj.output, "exitCode": obj.exitCode };
    };
    ;
    /**
     * 执行 shell 命令
     * @param args 命令参数
     */
    UIAutomatorServer.prototype.adb_shell = function (args) {
        return this.shell(args, 60).output;
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
    UIAutomatorServer.prototype.AppStart = function (pkgName, activity, wait, stop, unlock) {
        if (activity === void 0) { activity = null; }
        if (wait === void 0) { wait = true; }
        if (stop === void 0) { stop = false; }
        if (unlock === void 0) { unlock = false; }
        if (unlock) {
            this.Unlock();
        }
        if (activity != null) {
            var args = [
                'am', 'start', '-a', 'android.intent.action.MAIN', '-c',
                'android.intent.category.LAUNCHER'
            ];
            if (wait) {
                args.push("-W");
            }
            if (stop) {
                args.push("-S");
            }
            args.push("-n");
            args.push(pkgName + "/" + activity);
            this.shell(args);
            return true;
        }
        else {
            if (stop) {
                this.AppStop(pkgName);
                return true;
            }
            else {
                this.shell([
                    'monkey', '-p', pkgName, '-c',
                    'android.intent.category.LAUNCHER', '1'
                ]);
                return true;
            }
        }
    };
    /**
     * 获得当前app的信息
     * @constructor
     */
    UIAutomatorServer.prototype.CurrentApp = function () {
        var arr;
        var result;
        var index;
        var m = this.shell("dumpsys window | grep mFocusedWindow", 60).output;
        if (m.length > 0) {
            m = m.trim();
            index = m.lastIndexOf(" ") + 1;
            result = m.substring(index, m.length).replace("}", "");
            arr = result.split("/");
            return { package: arr[0], activity: arr[1] };
        }
        //获取当前包名的另一种方式
        m = this.shell("dumpsys activity top | grep ACTIVITY", 60).output;
        if (m.length > 0) {
            m = m.replace("\n", "").replace("ACTIVITY", "").trim();
            index = m.indexOf(" ");
            result = m.substring(0, index);
            arr = result.split("/");
            return { package: arr[0], activity: arr[0] + arr[1] };
        }
        throw new Error("获取当前应用包名和activity失败");
    };
    ;
    /**
     * 等待 activity出现或消失
     * @param activity 等待的activity
     * @param timeout 超时时间
     * @constructor
     */
    UIAutomatorServer.prototype.WaitActivity = function (activity, timeout) {
        if (timeout === void 0) { timeout = 10; }
        var time = 0;
        while (time < timeout) {
            var current_activity = this.CurrentApp().activity;
            if (activity == current_activity)
                return true;
            sleep(1000);
            time++;
        }
        return false;
    };
    ;
    /**
     * 关闭app
     * @param pkg_name 包名
     * @constructor
     */
    UIAutomatorServer.prototype.AppStop = function (pkg_name) {
        this.shell(['am', 'force-stop', pkg_name], 60);
        return true;
    };
    ;
    /**
     * 停止所有app
     * @param excludes 要停止的app集合
     * @constructor
     */
    UIAutomatorServer.prototype.AppStopAll = function (excludes) {
        if (excludes === void 0) { excludes = new Array(); }
        if (excludes.length <= 0)
            return;
        //不会被关闭的app
        var our_apps = ['com.github.uiautomator', 'com.github.uiautomator.test'];
        var m = this.shell(["pm", "list", "packages", "-3"], 60).output;
        if (m.length <= 0)
            throw new Error("获取系统所有包名失败");
        var items = m.split("\n");
        for (var i = 0; i < items.length; i++) {
            var element = items[i];
            if (element.length <= 0)
                continue;
            if (element.indexOf("package:") == -1)
                continue;
            var pkg = element.replace("package:", "");
            if (our_apps.indexOf(pkg) != -1) {
                continue;
            }
            if (excludes.indexOf(pkg) != -1) {
                this.AppStop(pkg);
            }
        }
    };
    ;
    /**
     * 停止并清除应用数据：pm清除
     * @param pkg_name 包名
     * @constructor
     */
    UIAutomatorServer.prototype.AppClear = function (pkg_name) {
        this.shell(['pm', 'clear', pkg_name], 60);
    };
    ;
    /**
     * 卸载app
     * @param pkg_name 包名
     * @constructor
     */
    UIAutomatorServer.prototype.AppUninstall = function (pkg_name) {
        this.shell(["pm", "uninstall", pkg_name], 60);
    };
    ;
    /**
     * 卸载所有app
     * @param excludes 要卸载的包名
     * @constructor
     */
    UIAutomatorServer.prototype.AppUninstallAll = function (excludes) {
        if (excludes === void 0) { excludes = new Array(); }
        if (excludes.length <= 0)
            return;
        //不会被卸载的app
        var our_apps = ['com.github.uiautomator', 'com.github.uiautomator.test'];
        var m = this.shell(["pm", "list", "packages", "-3"], 60).output;
        if (m.length <= 0)
            throw new Error("获取系统所有包名失败");
        var items = m.split("\n");
        for (var i = 0; i < items.length; i++) {
            var element = items[i];
            if (element.length <= 0)
                continue;
            if (element.indexOf("package:") == -1)
                continue;
            var pkg = element.replace("package:", "");
            if (our_apps.indexOf(pkg) != -1) {
                continue;
            }
            if (excludes.indexOf(pkg) != -1) {
                this.AppUninstall(pkg);
            }
        }
    };
    ;
    /**
     * 解锁屏幕
     * @constructor
     */
    UIAutomatorServer.prototype.Unlock = function () {
        this.OpenIdentify();
        return this.Session.Press("home");
    };
    ;
    /**
     *
     * @param theme black or red
     * @constructor
     */
    UIAutomatorServer.prototype.OpenIdentify = function (theme) {
        if (theme === void 0) { theme = "black"; }
        this.shell([
            'am', 'start', '-W', '-n',
            'com.github.uiautomator/.IdentifyActivity', '-e', 'theme', theme
        ], 60);
    };
    ;
    /**
     * app信息
     * @param pkg_name 包名
     * @constructor
     */
    UIAutomatorServer.prototype.AppInfo = function (pkg_name) {
        var url = this.path2url("/packages/" + pkg_name + "/info");
        var r = http.get(url);
        var json = r.body.string();
        if (json.length <= 0) {
            throw new Error("获取app信息失败");
        }
        var resp = JSON.parse(json);
        if (!resp.success) {
            throw new Error(resp.description);
        }
        return resp.data;
    };
    ;
    /**
     * 格式化url
     * @param path 路径
     */
    UIAutomatorServer.prototype.path2url = function (path) {
        return this.serverUrl + path;
    };
    ;
    return UIAutomatorServer;
}());
exports.UIAutomatorServer = UIAutomatorServer;
