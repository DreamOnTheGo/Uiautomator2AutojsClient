var Watchers = /** @class */ (function () {
    function Watchers(server) {
        this.server = server;
        this.WatcherNames = this.getWatchers();
    }
    Object.defineProperty(Watchers.prototype, "watched", {
        get: function () {
            this._watched = this.server.jsonrpc.setMethod("hasWatchedOnWindowsChange").call();
            return this._watched;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获得监听者集合
     */
    Watchers.prototype.getWatchers = function () {
        return this.server.jsonrpc.setMethod("getWatchers").call(null);
    };
    /**
     * 触发监听者
     * @constructor
     */
    Watchers.prototype.Triggered = function () {
        return this.server.jsonrpc.setMethod("hasAnyWatcherTriggered").call(null);
    };
    /**
     * 移除监听者
     * @param name 监听者名字，如果是null 则删除所有监听者
     * @constructor
     */
    Watchers.prototype.Remove = function (name) {
        if (name === void 0) { name = null; }
        if (name != null) {
            this.server.jsonrpc.setMethod("removeWatcher").callVoid(null);
        }
        else {
            for (var i = 0; i < this.WatcherNames.length; i++) {
                this.server.jsonrpc.setMethod("removeWatcher").callVoid(null);
            }
        }
    };
    /**
     * 重启
     * @constructor
     */
    Watchers.prototype.Reset = function () {
        this.server.jsonrpc.setMethod("resetWatcherTriggers").callVoid(null);
        return this;
    };
    /**
     * 强制运行所有监听者。
     * @constructor
     */
    Watchers.prototype.Run = function () {
        this.server.jsonrpc.setMethod("runWatchers").callVoid(null);
        return this;
    };
    /**
     * 自动点击权限弹出窗口
     * @param b 是否自动点击
     * @constructor
     */
    Watchers.prototype.Watched = function (b) {
        this.server.jsonrpc.setMethod("runWatchersOnWindowsChange").callVoid(null);
    };
    return Watchers;
}());
exports.Watchers = Watchers;
