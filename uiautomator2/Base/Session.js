var Toast_1 = require("./Toast");
var Touch_1 = require("./Touch");
var Watcher_1 = require("./Watcher");
var Watchers_1 = require("./Watchers");
var UiObject_1 = require("./UiObject");
var Session = /** @class */ (function () {
    function Session(server, pkg_name, pid) {
        if (pkg_name === void 0) { pkg_name = null; }
        if (pid === void 0) { pid = null; }
        /**
         * 屏幕方向
         */
        this._orientation = {
            natural: 0,
            n: 0,
            left: 90,
            l: 90,
            upsidedown: 180,
            u: 180,
            right: 270,
            r: 270
        };
        this.server = server;
        this.pkgName = pkg_name;
        this.Pid = pid;
        this.jsonrpc = this.getWrapper(server);
        this.shell = server.shell;
        this.Touch = this.getTouch();
    }
    Session.prototype.getWrapper = function (s) {
        var rpc = s.jsonrpc;
        if (this.Pid != null && this.pkgName != null) {
            var url = s.path2url("/session/" + this.Pid + ":" + this.pkgName + "/jsonrpc/0");
            rpc = s.SetupJsonRpc(url);
        }
        return rpc;
    };
    Session.prototype.getTouch = function () {
        return new Touch_1.Touch(this);
    };
    /**
     * 设置默认等待超时
     * @param seconds 超时时间
     * @constructor
     */
    Session.prototype.ImplicitlyWait = function (seconds) {
        if (seconds === void 0) { seconds = null; }
        if (seconds != null) {
            this.server.waitTimeOut = seconds;
        }
        return this.server.waitTimeOut;
    };
    ;
    /**
     * 关闭app
     * @constructor
     */
    Session.prototype.Close = function () {
        if (this.pkgName != null) {
            this.server.AppStop(this.pkgName);
        }
    };
    ;
    /**
     * 检测app是否正在运行
     * @constructor
     */
    Session.prototype.Running = function () {
        if (this.Pid != null && this.pkgName != null) {
            var pingUrl = this.server.path2url("/session/" + this.Pid + ":" + this.pkgName + "/ping");
            var r = http.get(pingUrl);
            var text = r.body.string();
            return text.trim() == "pong";
        }
        return true;
    };
    ;
    /**
     * 调整坐标
     * @param x
     * @param y
     * @constructor
     */
    Session.prototype.PosRel2abs = function (x, y) {
        var sezi = new Array();
        if (x < 0 || y < 0) {
            throw new Error("x坐标或y坐标不能小于0");
        }
        if ((x < 1 || y < 1) && sezi.length <= 0) {
            var ponstion = this.server.WindowSize();
            sezi.push(ponstion.x);
            sezi.push(ponstion.y);
        }
        if (x < 1)
            x = sezi[0] * x;
        if (y < 1)
            y = sezi[1] * y;
        return { x: x, y: y };
    };
    /**
     * 弹出显示框
     * @param text 显示的文本
     * @param duration 显示时间
     * @constructor
     */
    Session.prototype.MakeToast = function (text, duration) {
        if (duration === void 0) { duration = 1; }
        return this.jsonrpc.setMethod("makeToast").call([text, duration]);
    };
    /**
     * 弹出框管理器
     * @constructor
     */
    Session.prototype.Toast = function () {
        return new Toast_1.Toast(this);
    };
    /**
     * 设置输入法到设备
     * @param enable 是否启动
     * @constructor
     */
    Session.prototype.SetFastinputIme = function (enable) {
        if (enable === void 0) { enable = true; }
        var fastIme = "com.github.uiautomator/.FastInputIME";
        if (enable) {
            this.server.shell(['ime', 'enable', fastIme]);
            this.server.shell(['ime', 'set', fastIme]);
        }
        else {
            //卸载输入法
            this.server.shell(['ime', 'disable', fastIme]);
        }
    };
    /**
     * 等待 Fastinput 输入法准备就绪
     * @param timeout 等待的超时时间
     * @constructor
     */
    Session.prototype.WaitFastinputIme = function (timeout) {
        if (timeout === void 0) { timeout = 5; }
        var imei = this.server.Serial();
        if (imei == null) {
            throw new Error("不支持Android模拟器。");
        }
        var cuTime = 0;
        while (cuTime < timeout) {
            var ime = this.CurrentIme();
            if (ime.MethodId != "com.github.uiautomator/.FastInputIME") {
                this.SetFastinputIme(true);
                sleep(500);
                continue;
            }
            if (ime.Shown) {
                return true;
            }
            sleep(1000);
        }
        throw new Error("FastInputIME 输入法启动失败");
    };
    /**
     * 当前设备的输入法
     * @constructor
     */
    Session.prototype.CurrentIme = function () {
        var m = this.server.shell("dumpsys input_method | grep mEnabledInputMethodsStrCache").output;
        var method_id = m.trim().replace("\n", "").replace("mEnabledInputMethodsStrCache=", "");
        m = this.server.shell("dumpsys input_method | grep mInputShown").output;
        var shown = m.indexOf("mInputShown=true") != -1;
        return { MethodId: method_id, Shown: shown };
    };
    /**
     * 输入字符串
     * @param text
     * @constructor
     */
    Session.prototype.SetText = function (text) {
        //TODO send_keys
        this.WaitFastinputIme();
        var t = Base64.encode(text);
        this.server.shell([
            'am', 'broadcast', '-a', 'ADB_INPUT_TEXT', '--es', 'text',
            t
        ]);
        return true;
    };
    /**
     * 模拟输入法edito代码
     * @param code 输入法编辑器代码 ,按键码有 go,search,send,next,done,previous
     * @constructor
     *
     * 示列：
     *  SetAction("search") 或  SetAction(3)
     */
    Session.prototype.SetAction = function (code) {
        this.WaitFastinputIme();
        var __alias = {
            "go": 2,
            "search": 3,
            "send": 4,
            "next": 5,
            "done": 6,
            "previous": 7,
        };
        if (typeof code == "string") {
            code = __alias[code];
            if (code == null || code == undefined) {
                throw new Error("code填写错误");
            }
        }
        this.server.shell(['am', 'broadcast', '-a', 'ADB_EDITOR_CODE', '--ei', 'code', code.toString()]);
    };
    /**
     * 删除文本
     * @constructor
     */
    Session.prototype.ClearText = function () {
        try {
            this.WaitFastinputIme();
            this.server.shell(['am', 'broadcast', '-a', 'ADB_CLEAR_TEXT']);
        }
        catch (e) {
            //对于Android模拟器
            //TODO focused 对于模拟器的
        }
    };
    /**
     * 点击坐标
     * @param x x坐标
     * @param y y坐标
     * @constructor
     */
    Session.prototype.Tap = function (x, y) {
        return this.Click(x, y);
    };
    /**
     * 点击坐标
     * @param x x坐标
     * @param y y坐标
     * @constructor
     */
    Session.prototype.Click = function (x, y) {
        var xy = this.PosRel2abs(x, y);
        return this.jsonrpc.setMethod("click").call([xy.x, xy.y]);
    };
    /**
     * 双击
     * @param x x坐标
     * @param y y坐标
     * @param duration 点击时长 秒为单位
     * @constructor
     */
    Session.prototype.DoubleClick = function (x, y, duration) {
        if (duration === void 0) { duration = 0.1; }
        var xy = this.PosRel2abs(x, y);
        x = xy.x;
        y = xy.y;
        this.Touch.Down(x, y);
        this.Touch.Up(x, y);
        sleep(duration * 1000);
        this.Click(x, y);
        return true;
    };
    /**
     * 长按点击
     * @param x x坐标
     * @param y y坐标
     * @param duration 点击时长，秒为单位
     * @constructor
     */
    Session.prototype.LongClick = function (x, y, duration) {
        if (duration === void 0) { duration = 0.5; }
        var xy = this.PosRel2abs(x, y);
        x = xy.x;
        y = xy.y;
        this.Touch.Down(x, y);
        sleep(duration * 1000);
        this.Touch.Up(x, y);
        return true;
    };
    /**
     * 滑动坐标
     * @param fx x起始坐标
     * @param fy y起始坐标
     * @param tx x结束坐标
     * @param ty y结束坐标
     * @param duration 滑动时间，秒为单位，默认0.1秒
     * @constructor
     */
    Session.prototype.Swipe = function (fx, fy, tx, ty, duration) {
        if (duration === void 0) { duration = 0.1; }
        var fxy = this.PosRel2abs(fx, fy);
        fx = fxy.x;
        fy = fxy.y;
        var tfy = this.PosRel2abs(tx, ty);
        tx = tfy.x;
        ty = tfy.y;
        var steps = duration * 200;
        return this.jsonrpc.setMethod("swipe").call([fx, fy, tx, ty, steps]);
    };
    /**
     * 根据坐标集合滑动屏幕
     * @param points xy坐标集合 [200, 300, 210, 320]  [x,y ,x,y]
     * @param duration 滑动时间 默认0.5秒
     * @constructor
     */
    Session.prototype.SwipePoints = function (points, duration) {
        if (duration === void 0) { duration = 0.5; }
        var steps = duration * 200;
        return this.jsonrpc.setMethod("swipePoints").call([points, steps]);
    };
    /**
     * 从一个点滑动到另外一个点
     * @param sx x起始坐标
     * @param sy y起始坐标
     * @param ex x结束坐标
     * @param ey y结束坐标
     * @param duration 滑动时间，秒为单位，默认0.5秒
     * @constructor
     */
    Session.prototype.Drag = function (sx, sy, ex, ey, duration) {
        if (duration === void 0) { duration = 0.5; }
        var sxy = this.PosRel2abs(sx, sy);
        var exy = this.PosRel2abs(ex, ey);
        sx = sxy.x;
        sy = sxy.y;
        ex = exy.x;
        ey = sxy.y;
        var setps = duration * 200;
        return this.jsonrpc.setMethod("drag").call([sx, sy, ex, ey, setps]);
    };
    /**
     * 截图，图片格式保存为 JPEG
     * @param filename 保存文件名
     * @param format 保存的文件名为空时使用。 一个“pillow”或“opencv”
     * @constructor
     *
     * 示列：
     *  Screenshot("saved.jpg")
     */
    Session.prototype.Screenshot = function (filename, format) {
        if (format === void 0) { format = "pillow"; }
        var url = this.server.ScreenshotUri;
        var r = http.get(url);
        //TODO 保存图片到本地暂未实现
    };
    /**
     * Dump 节点层次结构
     * @param compressed
     * @param pretty
     * @constructor
     */
    Session.prototype.DumpHierarchy = function (compressed, pretty) {
        if (compressed === void 0) { compressed = false; }
        if (pretty === void 0) { pretty = false; }
        var content = this.jsonrpc.setMethod("dumpWindowHierarchy").call([compressed, null]);
        if (content.length <= 0)
            throw new Error("Dump 节点层次结构 失败");
        if (pretty && content.indexOf("\n") == -1) {
            //TODO 执行xml转换
        }
        return content;
    };
    /**
     * 在当前状态下冻结或解冻设备旋转。
     * @param freeze 是否冻结旋转。
     * @constructor
     */
    Session.prototype.FreezeRotation = function (freeze) {
        if (freeze === void 0) { freeze = true; }
        this.jsonrpc.setMethod("freezeRotation").call([freeze]);
    };
    /**
     * 通过 key或者 keyName 发起手机按键事件
     * @param key  home, back, left, right, up, down, center, menu, search, enter, delete(or del), recent(recent apps), volume_up, volume_down, volume_mute, camera, power.
     * @param meta
     * @constructor
     */
    Session.prototype.Press = function (key, meta) {
        if (meta === void 0) { meta = null; }
        if (typeof key == "number") {
            if (meta != null) {
                return this.jsonrpc.setMethod("pressKeyCode").call([key, meta]);
            }
            else {
                return this.jsonrpc.setMethod("pressKeyCode").call([key]);
            }
        }
        else {
            return this.jsonrpc.setMethod("pressKey").call([key]);
        }
    };
    /**
     * 亮屏
     * @constructor
     */
    Session.prototype.ScreenOn = function () {
        this.jsonrpc.setMethod("wakeUp").callVoid(null);
    };
    /**
     * 关闭屏幕
     * @constructor
     */
    Session.prototype.ScreenOff = function () {
        this.jsonrpc.setMethod("sleep").callVoid(null);
    };
    /**
     * 获得屏幕方法
     * @constructor
     */
    Session.prototype.GetOrientation = function () {
        var obj = this.info();
        return obj.displayRotation;
    };
    /**
     * 设置屏幕方向
     * @param value 方向 natural/n(垂直) left/l(左边) upsidedown/u(上边) right/r(右边)
     * @constructor
     */
    Session.prototype.SetOrientation = function (value) {
        var v = this._orientation[value];
        if (v != null) {
            this.jsonrpc.setMethod("setOrientation").callVoid([v]);
        }
    };
    /**
     * 获取最后遍历的文本。 在webview中用于突出显示的文本。
     * @constructor
     */
    Session.prototype.LastTraversedText = function () {
        return this.jsonrpc.setMethod("getLastTraversedText").call(null);
    };
    /**
     * 清除最后遍历的文本。
     * @constructor
     */
    Session.prototype.ClearTraversedText = function () {
        return this.jsonrpc.setMethod("clearLastTraversedText").call(null);
    };
    /**
     * 打开通知栏
     * @constructor
     */
    Session.prototype.OpenNotification = function () {
        return this.jsonrpc.setMethod("openNotification").call(null);
    };
    /**
     * 打开快速设置
     * @constructor
     */
    Session.prototype.OpenQuickSettings = function () {
        return this.jsonrpc.setMethod("openQuickSettings").call(null);
    };
    /**
     * 控件是否存在
     * @param param 节点参数
     * @constructor
     */
    Session.prototype.Exists = function (param) {
        return new UiObject_1.UiObject(this, param).Exists;
    };
    /**
     * 监听者
     * @param name 监听者名字
     * @constructor
     */
    Session.prototype.Watcher = function (name) {
        return new Watcher_1.Watcher(this, name);
    };
    ;
    /**
     * 监听者
     * @constructor
     */
    Session.prototype.Watchers = function () {
        return new Watchers_1.Watchers(this);
    };
    /**
     * 设备信息
     */
    Session.prototype.info = function () {
        return this.jsonrpc.setMethod("deviceInfo").call(null);
    };
    /**
     * 执行操作
     * @param selector
     * @constructor
     */
    Session.prototype.When = function (selector) {
        return new UiObject_1.UiObject(this, selector);
    };
    return Session;
}());
exports.Session = Session;
var orientation;
(function (orientation) {
    /**
     * 垂直显示
     */
    orientation[orientation["natural"] = 0] = "natural";
    /**
     * 垂直显示
     */
    orientation[orientation["n"] = 0] = "n";
    /**
     * 左边显示
     */
    orientation[orientation["left"] = 90] = "left";
    /**
     * 左边显示
     */
    orientation[orientation["l"] = 90] = "l";
    /**
     * 向上显示
     */
    orientation[orientation["upsidedown"] = 180] = "upsidedown";
    /**
     * 向上显示
     */
    orientation[orientation["u"] = 180] = "u";
    /**
     * 右边显示
     */
    orientation[orientation["right"] = 270] = "right";
    /**
     * 右边显示
     */
    orientation[orientation["r"] = 270] = "r";
})(orientation = exports.orientation || (exports.orientation = {}));
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    /**
     * 编码
     * @param e
     */
    encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64;
            }
            else if (isNaN(i)) {
                a = 64;
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
        }
        return t;
    },
    /**
     * 解码
     * @param e
     */
    decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r);
            }
            if (a != 64) {
                t = t + String.fromCharCode(i);
            }
        }
        t = Base64._utf8_decode(t);
        return t;
    },
    _utf8_encode: function (e) {
        e = e.replace(/rn/g, "n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
            }
            else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128);
            }
            else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128);
            }
        }
        return t;
    },
    _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r, c1, c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++;
            }
            else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2;
            }
            else {
                c2 = e.charCodeAt(n + 1);
                var c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3;
            }
        }
        return t;
    }
};
