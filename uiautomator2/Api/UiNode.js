var UiObject_1 = require("../Base/UiObject");
var Selector_1 = require("../Base/Selector");
var UiNode = /** @class */ (function () {
    function UiNode(objInfo, session) {
        this.session = session;
        this.info = objInfo;
        var selector = new Selector_1.SelectorParam();
        selector.className = objInfo.className != null ? objInfo.className : undefined;
        selector.description = objInfo.contentDescription != null ? objInfo.contentDescription : undefined;
        selector.packageName = objInfo.packageName != null ? objInfo.packageName : undefined;
        selector.resourceId = objInfo.resourceName != null ? objInfo.resourceName : undefined;
        selector.text = objInfo.text != null ? objInfo.text : undefined;
        selector.checkable = objInfo.checkable == true ? true : undefined;
        selector.checked = objInfo.checked ? true : undefined;
        selector.clickable = objInfo.clickable ? true : undefined;
        selector.enabled = objInfo.enabled ? true : undefined;
        selector.focusable = objInfo.focusable ? true : undefined;
        selector.focused = objInfo.focused ? true : undefined;
        selector.longClickable = objInfo.longClickable ? true : undefined;
        selector.scrollable = objInfo.scrollable ? true : undefined;
        selector.selected = objInfo.selected ? true : undefined;
        this.uiobject = new UiObject_1.UiObject(this.session, new Selector_1.Selector(selector));
    }
    UiNode.create = function (objInfo, session) {
        return new UiNode(objInfo, session);
    };
    Object.defineProperty(UiNode.prototype, "method", {
        /**
         * 节点的方法
         */
        get: function () {
            return new UiNodeMethod(this.uiobject, this.session);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "bounds", {
        /**
         * 边界
         */
        get: function () {
            return this.info.bounds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "childCount", {
        /**
         * 子节点数
         */
        get: function () {
            return this.info.childCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "className", {
        /**
         * classNamw
         */
        get: function () {
            return this.info.className;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "desc", {
        /**
         * desc
         */
        get: function () {
            return this.info.contentDescription;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "packageName", {
        /**
         * 包名
         */
        get: function () {
            return this.info.packageName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "id", {
        /**
         * Id
         */
        get: function () {
            return this.info.resourceName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "text", {
        /**
         * text
         */
        get: function () {
            return this.info.text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "visibleBounds", {
        /**
         * 可见边界
         */
        get: function () {
            return this.info.visibleBounds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "checkable", {
        /**
         * 是否可选中
         */
        get: function () {
            return this.info.checkable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "checked", {
        /**
         * 是否选中
         */
        get: function () {
            return this.info.checked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "clickable", {
        /**
         * 是否可以点击
         */
        get: function () {
            return this.info.clickable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "enabled", {
        /**
         * 是否有效
         */
        get: function () {
            return this.info.enabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "focusable", {
        /**
         * 是否可置入焦点
         */
        get: function () {
            return this.info.focusable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "focused", {
        /**
         * 是否已置入焦点
         */
        get: function () {
            return this.info.focused;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "longClickable", {
        /**
         * 是否可以长按点击
         */
        get: function () {
            return this.info.longClickable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "scrollable", {
        /**
         * 是否可以滚动
         */
        get: function () {
            return this.info.scrollable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNode.prototype, "selected", {
        /**
         * 是否选中
         */
        get: function () {
            return this.info.selected;
        },
        enumerable: true,
        configurable: true
    });
    return UiNode;
}());
exports.UiNode = UiNode;
/**
 * 节点的方法
 */
var UiNodeMethod = /** @class */ (function () {
    function UiNodeMethod(obj, session) {
        this.uiobject = obj;
        this.session = session;
    }
    Object.defineProperty(UiNodeMethod.prototype, "WaitTimeout", {
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
    Object.defineProperty(UiNodeMethod.prototype, "Exists", {
        /**
         * 是否存在
         * @constructor
         */
        get: function () {
            return this.uiobject.Exists;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UiNodeMethod.prototype, "Info", {
        /**
         * 节点信息
         * @constructor
         */
        get: function () {
            return this.uiobject.Info;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 点击元素
     * @param timeout
     * @param offset
     */
    UiNodeMethod.prototype.click = function (timeout, offset) {
        if (timeout === void 0) { timeout = null; }
        if (offset === void 0) { offset = null; }
        return this.uiobject.click(timeout, offset);
    };
    /**
     * 控件的中心坐标
     * @param offset 偏移量
     * @constructor
     */
    UiNodeMethod.prototype.Center = function (offset) {
        if (offset === void 0) { offset = null; }
        return this.uiobject.Center(offset);
    };
    /**
     * 点击后 直到元素消失
     * @param maxretry 等待的超时时间 单位秒
     * @param interval 轮训的时间间隔，单位秒
     * @constructor
     */
    UiNodeMethod.prototype.ClickGone = function (maxretry, interval) {
        if (maxretry === void 0) { maxretry = 10; }
        if (interval === void 0) { interval = 1; }
        return this.uiobject.ClickGone(maxretry, interval);
    };
    /**
     * 点击元素,并返回是否点击成功
     * @param timeout 超时时间
     * @constructor
     */
    UiNodeMethod.prototype.ClickExists = function (timeout) {
        if (timeout === void 0) { timeout = 0; }
        return this.uiobject.ClickExists(timeout);
    };
    /**
     * 长按点击
     * @param duration 长按的时间
     * @param timeout 等元素出现的时间
     * @constructor
     */
    UiNodeMethod.prototype.LongClick = function (duration, timeout) {
        if (duration === void 0) { duration = null; }
        if (timeout === void 0) { timeout = null; }
        return this.uiobject.LongClick(duration, timeout);
    };
    /**
     * 滚动 到某个节点
     * @param x x坐标
     * @param y y坐标
     * @param duration 滚动时间
     * @param timeout 等元素出现的时间
     * @param selector 元素信息
     * @constructor
     */
    UiNodeMethod.prototype.DragTo = function (x, y, duration, timeout, selector) {
        if (duration === void 0) { duration = 0.5; }
        if (timeout === void 0) { timeout = null; }
        if (selector === void 0) { selector = null; }
        return this.uiobject.DragTo(x, y, duration, timeout, selector);
    };
    /**
     * 滑屏
     * @param direction 滑动方向 "left", "right", "up", "down"
     * @param steps 滑动步数
     * @constructor
     */
    UiNodeMethod.prototype.Swipe = function (direction, steps) {
        if (steps === void 0) { steps = 10; }
        return this.uiobject.Swipe(direction, steps);
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
    UiNodeMethod.prototype.Gesture = function (start1, start2, end1, end2, steps) {
        if (steps === void 0) { steps = 0.5; }
        return this.uiobject.Gesture(start1, start2, end1, end2, steps);
    };
    /**
     * 执行双指针手势，其中每个指针从此边缘到此UiObject的中心对角线移动。
     * @param percent 捏合手势的对象对角线长度的百分比
     * @param steps 捏合速度,单位秒
     * @constructor
     */
    UiNodeMethod.prototype.PinchIn = function (percent, steps) {
        if (percent === void 0) { percent = 100; }
        if (steps === void 0) { steps = 0.5; }
        return this.uiobject.PinchIn(percent, steps);
    };
    /**
     * 执行双指针手势，其中每个指针沿对角线方向相对移动，从中心向外移动到此UiObject的边缘。
     * @param percent 捏合手势的对象对角线长度的百分比
     * @param steps 捏合速度，单位秒
     * @constructor
     */
    UiNodeMethod.prototype.Pinchout = function (percent, steps) {
        if (percent === void 0) { percent = 100; }
        if (steps === void 0) { steps = 0.5; }
        return this.uiobject.Pinchout(percent, steps);
    };
    /**
     * 等待
     * @param exists 是否存在
     * @param timeout 超时时间
     * @constructor
     */
    UiNodeMethod.prototype.Wait = function (exists, timeout) {
        if (exists === void 0) { exists = true; }
        if (timeout === void 0) { timeout = null; }
        return this.uiobject.Wait(exists, timeout);
    };
    /**
     * 等待
     * @param timeout 超时时间
     * @constructor
     */
    UiNodeMethod.prototype.WaitGone = function (timeout) {
        if (timeout === void 0) { timeout = null; }
        return this.uiobject.WaitGone(timeout);
    };
    /**
     * 必须等待
     * @param exists 是否存在
     * @param timeout 超时时间
     * @constructor
     */
    UiNodeMethod.prototype.MustWait = function (exists, timeout) {
        if (exists === void 0) { exists = true; }
        if (timeout === void 0) { timeout = null; }
        return this.uiobject.MustWait(exists, timeout);
    };
    /**
     * 设置文本
     * @param text 要设置的文本
     * @param timeout 超时时间
     * @constructor
     */
    UiNodeMethod.prototype.SetText = function (text, timeout) {
        if (text === void 0) { text = null; }
        if (timeout === void 0) { timeout = null; }
        return this.uiobject.SetText(text, timeout);
    };
    /**
     * 获得文本
     * @param timeout 超时时间
     * @constructor
     */
    UiNodeMethod.prototype.GetText = function (timeout) {
        if (timeout === void 0) { timeout = null; }
        return this.uiobject.GetText(timeout);
    };
    /**
     * 清除文本
     * @param timeout 超时时间
     * @constructor
     */
    UiNodeMethod.prototype.ClearText = function (timeout) {
        if (timeout === void 0) { timeout = null; }
        return this.uiobject.ClearText(timeout);
    };
    /**
     * 子集对象
     * @param selector 子集信息
     * @constructor
     */
    UiNodeMethod.prototype.ChildSelector = function (selector) {
        var node = null;
        var obj = this.uiobject.ChildSelector(selector).Info;
        if (obj != null) {
            node = UiNode.create(obj, this.session);
        }
        return node;
    };
    /**
     *
     * @param selector
     * @constructor
     */
    UiNodeMethod.prototype.FromParent = function (selector) {
        var node = null;
        var obj = this.uiobject.FromParent(selector).Info;
        if (obj != null) {
            node = UiNode.create(obj, this.session);
        }
        return node;
    };
    /**
     * 获得子集的text文本
     * @param text
     * @param allowScrollSearch 允许滚动搜索
     * @param selector
     * @constructor
     */
    UiNodeMethod.prototype.ChildByText = function (text, selector, allowScrollSearch) {
        if (allowScrollSearch === void 0) { allowScrollSearch = null; }
        var node = null;
        var obj = this.uiobject.ChildByText(text, selector, allowScrollSearch).Info;
        if (obj != null) {
            node = UiNode.create(obj, this.session);
        }
        return node;
    };
    /**
     * 获得子集的desc文本
     * @param text
     * @param selector
     * @param allowScrollSearch
     * @constructor
     */
    UiNodeMethod.prototype.ChildByDesc = function (text, selector, allowScrollSearch) {
        if (allowScrollSearch === void 0) { allowScrollSearch = null; }
        var node = null;
        var obj = this.uiobject.ChildByDesc(text, selector, allowScrollSearch).Info;
        if (obj != null) {
            node = UiNode.create(obj, this.session);
        }
        return node;
    };
    /**
     * 获得节点
     * @param index
     * @constructor
     */
    UiNodeMethod.prototype.Get = function (index) {
        var node = null;
        var obj = this.uiobject.Get(index).Info;
        if (obj != null) {
            node = UiNode.create(obj, this.session);
        }
        return node;
    };
    /**
     * 节点数量
     * @constructor
     */
    UiNodeMethod.prototype.Count = function () {
        return this.uiobject.Count();
    };
    UiNodeMethod.prototype.Right = function (selector) {
        var node = null;
        var obj = this.uiobject.Right(selector).Info;
        if (obj != null) {
            node = UiNode.create(obj, this.session);
        }
        return node;
    };
    UiNodeMethod.prototype.Left = function (selector) {
        var node = null;
        var obj = this.uiobject.Left(selector).Info;
        if (obj != null) {
            node = UiNode.create(obj, this.session);
        }
        return node;
    };
    UiNodeMethod.prototype.Up = function (selector) {
        var node = null;
        var obj = this.uiobject.Up(selector).Info;
        if (obj != null) {
            node = UiNode.create(obj, this.session);
        }
        return node;
    };
    UiNodeMethod.prototype.Down = function (selector) {
        var node = null;
        var obj = this.uiobject.Down(selector).Info;
        if (obj != null) {
            node = UiNode.create(obj, this.session);
        }
        return node;
    };
    return UiNodeMethod;
}());
exports.UiNodeMethod = UiNodeMethod;
