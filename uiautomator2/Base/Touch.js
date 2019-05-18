var Touch = /** @class */ (function () {
    function Touch(server) {
        this.server = server;
    }
    /**
     * 按下坐标
     * @param x x坐标
     * @param y y坐标
     * @constructor
     */
    Touch.prototype.Down = function (x, y) {
        return this.server.jsonrpc.setMethod("injectInputEvent").call([Touch.ACTION_DOW, x, y]);
    };
    /**
     * 移动坐标
     * @param x x坐标
     * @param y y坐标
     * @constructor
     */
    Touch.prototype.Move = function (x, y) {
        return this.server.jsonrpc.setMethod("injectInputEvent").call([Touch.ACTION_MOVE, x, y]);
    };
    /**
     * 抬起坐标
     * @param x x坐标
     * @param y y坐标
     * @constructor
     */
    Touch.prototype.Up = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        return this.server.jsonrpc.setMethod("injectInputEvent").call([Touch.ACTION_UP, x, y]);
    };
    Touch.ACTION_DOW = 0;
    Touch.ACTION_MOVE = 2;
    Touch.ACTION_UP = 1;
    return Touch;
}());
exports.Touch = Touch;
