var Toast = /** @class */ (function () {
    function Toast(session) {
        this.session = session;
    }
    /**
     * 获得弹出的 Toast 显示内容
     * @param waitTimeout  显示的最长等待时间的秒数
     * @param cacheTimeout 如果Toast最近显示，立即返回
     * @constructor
     */
    Toast.prototype.GetMessage = function (waitTimeout, cacheTimeout) {
        if (waitTimeout === void 0) { waitTimeout = 10; }
        if (cacheTimeout === void 0) { cacheTimeout = 10; }
        var cuTime = 0;
        while (cuTime < waitTimeout) {
            var message = this.session.jsonrpc.setMethod("getLastToast").call([cacheTimeout * 1000]);
            if (message != null) {
                return message;
            }
            cuTime++;
            sleep(1000);
        }
        return null;
    };
    /**
     * 清空最后一个toast
     * @constructor
     */
    Toast.prototype.Reset = function () {
        return this.session.jsonrpc.setMethod("clearLastToast").call(null);
    };
    /**
     * 弹出显示框
     * @param text 显示的文本
     * @param duration 显示时间
     * @constructor
     */
    Toast.prototype.Show = function (text, duration) {
        if (duration === void 0) { duration = 1; }
        return this.session.MakeToast(text, duration);
    };
    return Toast;
}());
exports.Toast = Toast;
