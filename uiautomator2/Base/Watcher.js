var Selector_1 = require("./Selector");
var Watcher = /** @class */ (function () {
    /***
     *
     * @param server
     * @param name 监听者名字
     */
    function Watcher(server, name) {
        this.server = server;
        this.__selectors = new Array();
        this.name = name;
    }
    /**
     * 触发监听
     * @constructor
     */
    Watcher.prototype.Triggered = function () {
        return this.server.jsonrpc.setMethod("hasWatcherTriggered").call([this.name]);
    };
    /**
     * 移除监听者
     * @constructor
     */
    Watcher.prototype.Remove = function () {
        return this.server.jsonrpc.setMethod("removeWatcher").call([this.name]);
    };
    /**
     *
     * @param selector
     * @constructor
     */
    Watcher.prototype.When = function (selector) {
        this.__selectors.push(new Selector_1.Selector(selector));
        return this;
    };
    /**
     * 注册点击 节点监听者
     * @param selector 节点信息
     * @constructor
     */
    Watcher.prototype.Click = function (selector) {
        if (selector === void 0) { selector = null; }
        var target = null;
        if (selector != null) {
            target = new Selector_1.Selector(selector);
        }
        else {
            if (this.__selectors.length > 0) {
                target = this.__selectors[this.__selectors.length - 1];
            }
        }
        if (target == null) {
            throw new Error("selector 信息为空");
        }
        this.server.jsonrpc.setMethod("registerClickUiObjectWatcher").callVoid([this.name, this.__selectors, target]);
    };
    /**
     * 注册按键监听
     * @param keys 按键码 ("home", "back", "left", "right", "up", "down", "center", search", "enter", "delete", "del", "recent", "volume_up", "menu", "volume_down", "volume_mute", "camera", "power")
     * @constructor
     */
    Watcher.prototype.Press = function (keys) {
        this.server.jsonrpc.setMethod("registerPressKeyskWatcher").callVoid([this.name, this.__selectors, keys]);
    };
    return Watcher;
}());
exports.Watcher = Watcher;
