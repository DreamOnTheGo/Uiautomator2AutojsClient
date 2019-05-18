var Selector_1 = require("./Selector");
var Exists_1 = require("./Exists");
var UiObject = /** @class */ (function () {
    function UiObject(session, selector) {
        this.session = session;
        this.selector = selector;
        this.jsonrpc = session.jsonrpc;
    }
    Object.defineProperty(UiObject.prototype, "WaitTimeout", {
        /**
         * 等待的超时时间
         * @constructor
         */
        get: function () {
            return this.session.server.waitTimeOut;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiObject.prototype, "Exists", {
        /**
         * 是否存在
         * @constructor
         */
        get: function () {
            return new Exists_1.Exists(this).call();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiObject.prototype, "Info", {
        /**
         * 节点信息
         * @constructor
         */
        get: function () {
            return this.jsonrpc.setMethod("objInfo").call([this.selector]);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 点击元素
     * @param timeout
     * @param offset
     */
    UiObject.prototype.click = function (timeout, offset) {
        if (timeout === void 0) { timeout = null; }
        if (offset === void 0) { offset = null; }
        this.MustWait(true, timeout);
        var xy = this.Center(offset);
        var x = xy.x;
        var y = xy.y;
        return this.session.Click(x, y);
    };
    /**
     * 控件的中心坐标
     * @param offset
     * @constructor
     */
    UiObject.prototype.Center = function (offset) {
        if (offset === void 0) { offset = null; }
        var info = this.Info;
        var lx = 0;
        var ly = 0;
        var rx = 0;
        var ry = 0;
        if (info.visibleBounds != null) {
            var bounds = info.visibleBounds;
            lx = bounds.left;
            ly = bounds.top;
            rx = bounds.right;
            ry = bounds.bottom;
        }
        else if (info.bounds != null) {
            var bounds = info.bounds;
            lx = bounds.left;
            ly = bounds.top;
            rx = bounds.right;
            ry = bounds.bottom;
        }
        if (offset == null) {
            offset = [0.5, 0.5];
        }
        var xoff = offset[0];
        var yoff = offset[1];
        var width = rx - lx;
        var height = ry - ly;
        var x = lx + width * xoff;
        var y = ly + height * yoff;
        return { x: x, y: y };
    };
    /**
     * 点击后 直到元素消失
     * @param maxretry 等待的超时时间 单位秒
     * @param interval 轮训的时间间隔，单位秒
     * @constructor
     */
    UiObject.prototype.ClickGone = function (maxretry, interval) {
        if (maxretry === void 0) { maxretry = 10; }
        if (interval === void 0) { interval = 1; }
        this.ClickExists();
        while (maxretry > 0) {
            sleep(interval * 1000);
            if (!this.Exists)
                return true;
            this.ClickExists();
            maxretry--;
        }
        return false;
    };
    /**
     * 点击元素,并返回是否点击成功
     * @param timeout 超时时间
     * @constructor
     */
    UiObject.prototype.ClickExists = function (timeout) {
        if (timeout === void 0) { timeout = 0; }
        try {
            return this.click(timeout);
        }
        catch (e) {
            return false;
        }
    };
    /**
     * 长按点击
     * @param duration 长按的时间
     * @param timeout 等元素出现的时间
     * @constructor
     */
    UiObject.prototype.LongClick = function (duration, timeout) {
        if (duration === void 0) { duration = null; }
        if (timeout === void 0) { timeout = null; }
        this.MustWait(true, timeout);
        var xy = this.Center();
        return this.session.LongClick(xy.x, xy.y);
    };
    /**
     *
     * @param x x坐标
     * @param y y坐标
     * @param duration 滚动时间
     * @param timeout 等元素出现的时间
     * @param selector 元素信息
     * @constructor
     */
    UiObject.prototype.DragTo = function (x, y, duration, timeout, selector) {
        if (duration === void 0) { duration = 0.5; }
        if (timeout === void 0) { timeout = null; }
        if (selector === void 0) { selector = null; }
        this.MustWait(true, timeout);
        var steps = duration * 200;
        if (x > 0 && y > 0) {
            var xy = this.session.PosRel2abs(x, y);
            return this.jsonrpc.setMethod("dragTo").call([this.selector, xy.x, xy.y, steps]);
        }
        return this.jsonrpc.setMethod("dragTo").call([this.selector, new Selector_1.Selector(selector), steps]);
    };
    /**
     * 滑屏
     * @param direction 滑动方向 "left", "right", "up", "down"
     * @param steps 滑动步数
     * @constructor
     */
    UiObject.prototype.Swipe = function (direction, steps) {
        if (steps === void 0) { steps = 10; }
        this.MustWait();
        var info = this.Info;
        var lx = 0;
        var ly = 0;
        var rx = 0;
        var ry = 0;
        if (info.visibleBounds != null) {
            var bounds = info.visibleBounds;
            lx = bounds.left;
            ly = bounds.top;
            rx = bounds.right;
            ry = bounds.bottom;
        }
        else if (info.bounds != null) {
            var bounds = info.bounds;
            lx = bounds.left;
            ly = bounds.top;
            rx = bounds.right;
            ry = bounds.bottom;
        }
        var cx = Math.floor((lx + rx) / 2);
        var cy = Math.floor((ly + ry) / 2);
        direction = direction.trim();
        if (direction == "up") {
            return this.session.Swipe(cx, cy, cx, ly, steps);
        }
        else if (direction == "down") {
            return this.session.Swipe(cx, cy, cx, ry - 1, steps);
        }
        else if (direction == "left") {
            return this.session.Swipe(cx, cy, lx, cy, steps);
        }
        else if (direction == "right") {
            return this.session.Swipe(cx, cy, rx - 1, cy, steps);
        }
        return false;
    };
    /**
     * 手势
     * @param start1 x起始坐标
     * @param start2 y起始坐标
     * @param end1 x结束坐标
     * @param end2 y结束坐标
     * @param steps 速度,单位秒
     * @constructor
     */
    UiObject.prototype.Gesture = function (start1, start2, end1, end2, steps) {
        if (steps === void 0) { steps = 0.5; }
        steps = steps * 200;
        var rel2abd = this.session.PosRel2abs;
        function ctp(pt) {
            if (pt instanceof Array) {
                return rel2abd(pt[0], pt[1]);
            }
            return pt;
        }
        var s1 = ctp(start1);
        var s2 = ctp(start2);
        var e1 = ctp(end1);
        var e2 = ctp(end2);
        return this.jsonrpc.setMethod("gesture").call([this.selector, s1, s2, e1, e2, steps]);
    };
    /**
     * 执行双指针手势，其中每个指针从此边缘到此UiObject的中心对角线移动。
     * @param percent 捏合手势的对象对角线长度的百分比
     * @param steps 捏合速度,单位秒
     * @constructor
     */
    UiObject.prototype.PinchIn = function (percent, steps) {
        if (percent === void 0) { percent = 100; }
        if (steps === void 0) { steps = 0.5; }
        steps = steps * 200;
        return this.jsonrpc.setMethod("pinchIn").call([this.selector, percent, steps]);
    };
    /**
     * 执行双指针手势，其中每个指针沿对角线方向相对移动，从中心向外移动到此UiObject的边缘。
     * @param percent 捏合手势的对象对角线长度的百分比
     * @param steps 捏合速度，单位秒
     * @constructor
     */
    UiObject.prototype.Pinchout = function (percent, steps) {
        if (percent === void 0) { percent = 100; }
        if (steps === void 0) { steps = 0.5; }
        steps = steps * 200;
        return this.jsonrpc.setMethod("pinchOut").call([this.selector, percent, steps]);
    };
    /**
     * 等待
     * @param exists 是否存在
     * @param timeout 超时时间
     * @constructor
     */
    UiObject.prototype.Wait = function (exists, timeout) {
        if (exists === void 0) { exists = true; }
        if (timeout === void 0) { timeout = null; }
        if (timeout == null) {
            timeout = this.WaitTimeout;
        }
        if (exists) {
            try {
                var steps = timeout * 1000;
                return this.jsonrpc.setMethod("waitForExists").call([this.selector, steps]);
            }
            catch (e) {
                return this.Exists;
            }
        }
        else {
            try {
                var steps = timeout * 1000;
                return this.jsonrpc.setMethod("waitUntilGone").call([this.selector, steps]);
            }
            catch (e) {
                return this.Exists;
            }
        }
    };
    /**
     * 等待
     * @param timeout 超时时间
     * @constructor
     */
    UiObject.prototype.WaitGone = function (timeout) {
        if (timeout === void 0) { timeout = null; }
        if (timeout == null) {
            timeout = this.WaitTimeout;
        }
        return this.Wait(false, timeout);
    };
    /**
     * 必须等待
     * @param exists 是否存在
     * @param timeout 超时时间
     * @constructor
     */
    UiObject.prototype.MustWait = function (exists, timeout) {
        if (exists === void 0) { exists = true; }
        if (timeout === void 0) { timeout = null; }
        if (!this.Wait(exists, timeout)) {
            throw new Error("MustWait 等待超时，没有找到节点");
        }
    };
    /**
     * 设置文本
     * @param text 要设置的文本
     * @param timeout 超时时间
     * @constructor
     */
    UiObject.prototype.SetText = function (text, timeout) {
        if (text === void 0) { text = null; }
        if (timeout === void 0) { timeout = null; }
        this.MustWait(true, timeout);
        if (text == null) {
            try {
                this.jsonrpc.setMethod("clearTextField").callVoid([this.selector]);
                return true;
            }
            catch (e) {
                return false;
            }
        }
        else {
            return this.jsonrpc.setMethod("setText").call([this.selector, text]);
        }
    };
    /**
     * 获得文本
     * @param timeout 超时时间
     * @constructor
     */
    UiObject.prototype.GetText = function (timeout) {
        if (timeout === void 0) { timeout = null; }
        this.MustWait(true, timeout);
        return this.jsonrpc.setMethod("getText").call([this.selector]);
    };
    /**
     * 清除文本
     * @param timeout 超时时间
     * @constructor
     */
    UiObject.prototype.ClearText = function (timeout) {
        if (timeout === void 0) { timeout = null; }
        this.MustWait(true, timeout);
        return this.SetText(null, null);
    };
    /**
     * 子集对象
     * @param selector 子集信息
     * @constructor
     */
    UiObject.prototype.ChildSelector = function (selector) {
        return new UiObject(this.session, this.selector.clone().child(selector));
    };
    /**
     *
     * @param selector
     * @constructor
     */
    UiObject.prototype.FromParent = function (selector) {
        return new UiObject(this.session, this.selector.clone().sibling(selector));
    };
    /**
     * 查找所有节点信息
     * @constructor
     */
    UiObject.prototype.FindAll = function () {
        return this.jsonrpc.setMethod("objInfoOfAllInstances").call([this.selector]);
    };
    /**
     * 获得子集的text文本
     * @param text
     * @param allowScrollSearch 允许滚动搜索
     * @param selector
     * @constructor
     */
    UiObject.prototype.ChildByText = function (text, selector, allowScrollSearch) {
        if (allowScrollSearch === void 0) { allowScrollSearch = null; }
        var name;
        if (allowScrollSearch != null) {
            name = this.jsonrpc.setMethod("childByText").call([this.selector, new Selector_1.Selector(selector), text, allowScrollSearch]);
        }
        else {
            name = this.jsonrpc.setMethod("childByText").call([this.selector, new Selector_1.Selector(selector), text]);
        }
        return new UiObject(this.session, name);
    };
    /**
     * 获得子集的desc文本
     * @param text
     * @param selector
     * @param allowScrollSearch
     * @constructor
     */
    UiObject.prototype.ChildByDesc = function (text, selector, allowScrollSearch) {
        if (allowScrollSearch === void 0) { allowScrollSearch = null; }
        var name;
        if (allowScrollSearch != null) {
            name = this.jsonrpc.setMethod("childByDescription").call([this.selector, new Selector_1.Selector(selector), text, allowScrollSearch]);
        }
        else {
            name = this.jsonrpc.setMethod("childByDescription").call([this.selector, new Selector_1.Selector(selector), text]);
        }
        return new UiObject(this.session, name);
    };
    /**
     * 获得节点
     * @param index
     * @constructor
     */
    UiObject.prototype.Get = function (index) {
        var selector = this.selector.clone();
        selector.update_instance(index);
        return new UiObject(this.session, selector);
    };
    /**
     * 节点数量
     * @constructor
     */
    UiObject.prototype.Count = function () {
        return this.jsonrpc.setMethod("count").call([this.selector]);
    };
    UiObject.prototype.Right = function (selector) {
        var intersects = this.intersect;
        function onsideof(rect1, rect2) {
            var rect3 = intersects(rect1, rect2);
            if (rect3.top < rect3.bottom) {
                return rect2.left - rect1.right;
            }
            return -1;
        }
        return this.__view_beside(onsideof, selector);
    };
    UiObject.prototype.Left = function (selector) {
        var intersects = this.intersect;
        function onsideof(rect1, rect2) {
            var rect3 = intersects(rect1, rect2);
            if (rect3.top < rect3.bottom) {
                return rect1.left - rect2.right;
            }
            return -1;
        }
        return this.__view_beside(onsideof, selector);
    };
    UiObject.prototype.Up = function (selector) {
        var intersects = this.intersect;
        function onsideof(rect1, rect2) {
            var rect3 = intersects(rect1, rect2);
            if (rect3.left < rect3.right) {
                return rect1.top - rect2.bottom;
            }
            return -1;
        }
        return this.__view_beside(onsideof, selector);
    };
    UiObject.prototype.Down = function (selector) {
        var intersects = this.intersect;
        function onsideof(rect1, rect2) {
            var rect3 = intersects(rect1, rect2);
            if (rect3.left < rect3.right) {
                return rect2.top - rect1.bottom;
            }
            return -1;
        }
        return this.__view_beside(onsideof, selector);
    };
    UiObject.prototype.__view_beside = function (onsideof, selector) {
        var bounds = this.Info.bounds;
        var uiObject = new UiObject(this.session, new Selector_1.Selector(selector));
        var min_dist = -1;
        var found = null;
        for (var i = 0; i < uiObject.Count(); i++) {
            var ui_1 = uiObject.Get(i);
            var dist = onsideof(bounds, ui_1.Info.bounds);
            if (dist >= 0 && (min_dist < 0 || dist < min_dist)) {
                min_dist = dist;
                found = ui_1;
            }
        }
        return found;
    };
    UiObject.prototype.intersect = function (rect1, rect2) {
        var top;
        var bottom;
        var left;
        var right;
        if (rect1.top > rect2.top) {
            top = rect1.top;
        }
        else {
            top = rect2.top;
        }
        if (rect1.bottom > rect2.bottom) {
            bottom = rect1.bottom;
        }
        else {
            bottom = rect2.bottom;
        }
        if (rect1.left > rect2.left) {
            left = rect1.left;
        }
        else {
            left = rect2.left;
        }
        if (rect1.right > rect2.right) {
            right = rect1.right;
        }
        else {
            right = rect2.right;
        }
        return { "top": top, "bottom": bottom, "left": left, "right": right };
    };
    return UiObject;
}());
exports.UiObject = UiObject;
var ObjInfo = /** @class */ (function () {
    function ObjInfo() {
    }
    return ObjInfo;
}());
exports.ObjInfo = ObjInfo;
var BoundsBean = /** @class */ (function () {
    function BoundsBean() {
    }
    return BoundsBean;
}());
exports.BoundsBean = BoundsBean;
var VisibleBoundsBean = /** @class */ (function () {
    function VisibleBoundsBean() {
    }
    return VisibleBoundsBean;
}());
exports.VisibleBoundsBean = VisibleBoundsBean;