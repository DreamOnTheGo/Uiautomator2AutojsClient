var JsonRpcClient_1 = require("./JsonRpcClient");
var JSONRpcWrapper = /** @class */ (function () {
    function JSONRpcWrapper(url) {
        this.url = url;
    }
    /**
     * 设置执行方法
     * @param method 方法名称
     */
    JSONRpcWrapper.prototype.setMethod = function (method) {
        this.method = method;
        return this;
    };
    ;
    JSONRpcWrapper.prototype.callVoid = function (param) {
        if (param === void 0) { param = null; }
        var jsonClient = new JsonRpcClient_1.JsonRpcClient(this.url);
        jsonClient.callMethod(this.method, param);
    };
    ;
    /**
     * 执行
     * @param param 参数
     */
    JSONRpcWrapper.prototype.call = function (param) {
        if (param === void 0) { param = null; }
        var jsonClient = new JsonRpcClient_1.JsonRpcClient(this.url);
        return jsonClient.callMethod(this.method, param);
    };
    ;
    return JSONRpcWrapper;
}());
exports.JSONRpcWrapper = JSONRpcWrapper;
