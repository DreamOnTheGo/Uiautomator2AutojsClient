var Exists = /** @class */ (function () {
    function Exists(uiobject) {
        this.uiobject = uiobject;
    }
    Exists.prototype.call = function (timeout) {
        if (timeout === void 0) { timeout = 0; }
        if (timeout > 0) {
            //this.uiobject
        }
        return this.uiobject.jsonrpc.setMethod("exist").call([this.uiobject.selector]);
    };
    return Exists;
}());
exports.Exists = Exists;
