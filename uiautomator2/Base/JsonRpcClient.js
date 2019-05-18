var JsonRpcClient = /** @class */ (function () {
    function JsonRpcClient(url) {
        this.jsonrpc_url = url;
    }
    /**
     * 执行
     * @param method 方法名
     * @param param
     */
    JsonRpcClient.prototype.callMethod = function (method, param) {
        return this.doJSONRequest(method, param);
    };
    ;
    JsonRpcClient.prototype.doJSONRequest = function (method, param) {
        var jsonObject = {
            "jsonrpc": "2.0",
            "id": this.guid(),
            "method": method,
            "params": []
        };
        if (param != null) {
            jsonObject.params = param;
        }
        var json = JSON.stringify(jsonObject);
        print("param=" + json);
        var r = http.postJson(this.jsonrpc_url, jsonObject);
        var text = r.body.string();
        if (text.length <= 0) {
            throw new Error("获取数据失败，请检测你的网络");
        }
        print("result=" + text);
        var obj = JSON.parse(text);
        if (text.indexOf("error") == -1) {
            if (text.indexOf("result") == -1) {
                throw new Error("返回值中没有 result");
            }
            return obj.result;
        }
        throw new Error(obj.message + method);
    };
    JsonRpcClient.prototype.guid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    ;
    return JsonRpcClient;
}());
exports.JsonRpcClient = JsonRpcClient;
