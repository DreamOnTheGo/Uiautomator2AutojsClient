var AdbShell = /** @class */ (function () {
    function AdbShell(shellfn) {
        this.shelf = shellfn;
    }
    /**
     * 获取屏幕宽度
     */
    AdbShell.prototype.wmsize = function () {
        var output = this.shelf("wm size").output;
        var reg = new RegExp(/(\d+)x(\d+)/);
        var arr = reg.exec(output);
        if (arr.length > 0) {
            return { x: parseInt(arr[1]), y: parseInt(arr[2]) };
        }
        throw new Error("获取屏幕宽带失败");
    };
    ;
    /**
     * 是否处于亮屏状态
     */
    AdbShell.prototype.is_screen_on = function () {
        var output = this.shelf("dumpsys power").output;
        //mHoldingDisplaySuspendBlocker=true 是亮屏，否则是黑屏
        return output.indexOf("mHoldingDisplaySuspendBlocker=true") != -1;
    };
    ;
    /**
     * 输入按键
     * @param v
     */
    AdbShell.prototype.keyevent = function (v) {
        v = v.toUpperCase();
        this.shelf("input keyevent " + v);
    };
    ;
    /**
     * 滑动
     * @param x0 x起始坐标
     * @param y0 y起始坐标
     * @param x1 x结束坐标
     * @param y1 y结束坐标
     */
    AdbShell.prototype.swipe = function (x0, y0, x1, y1) {
        var w, h = null;
        if (x0 < 1 || y0 < 1 || x1 < 1 || y1 < 1) {
            var sise = this.wmsize();
            w = sise.x;
            h = sise.y;
        }
        var xy0 = this._adjust_pos(x0, y0, w, h);
        var xy1 = this._adjust_pos(x1, y1, w, h);
        this.shelf("input swipe " + xy0.x + " " + xy0.y + " " + xy1.x + " " + xy1.y);
    };
    ;
    /**
     * 调整坐标
     * @param x
     * @param y
     * @param w
     * @param h
     * @private
     */
    AdbShell.prototype._adjust_pos = function (x, y, w, h) {
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        if (x < 1)
            x = x * w;
        if (y < 1)
            y = y * h;
        return { x: x, y: y };
    };
    return AdbShell;
}());
exports.AdbShell = AdbShell;
