var Selector_1 = require("../Base/Selector");
var UiNode_1 = require("./UiNode");
var By = /** @class */ (function () {
    function By(server) {
        this.selector = new Selector_1.SelectorParam();
        this.uiselector = new UiSelector(server);
    }
    /**
     * 文本
     * @param text text元素
     */
    By.prototype.text = function (text) {
        this.selector.text = text;
        return this;
    };
    /**
     * 文本包含
     * @param text text元素
     */
    By.prototype.textContains = function (text) {
        this.selector.textContains = text;
        return this;
    };
    /**
     * 文本正则匹配
     * @param text text元素
     */
    By.prototype.textMatches = function (text) {
        this.selector.textMatches = text;
        return this;
    };
    /**
     * 文本起始位置相同
     * @param text text元素
     */
    By.prototype.textStartsWith = function (text) {
        this.selector.textStartsWith = text;
        return this;
    };
    /**
     * className元素
     * @param claszz 类名
     */
    By.prototype.className = function (claszz) {
        this.selector.className = claszz;
        return this;
    };
    /**
     * className元素正则匹配
     * @param claszz 类名
     */
    By.prototype.classNameMatches = function (claszz) {
        this.selector.classNameMatches = claszz;
        return this;
    };
    /**
     * desc元素查找
     * @param desc 控件描述
     */
    By.prototype.desc = function (desc) {
        this.selector.description = desc;
        return this;
    };
    /**
     * desc元素包含
     * @param desc 控件描述
     */
    By.prototype.descContains = function (desc) {
        this.selector.descriptionContains = desc;
        return this;
    };
    /**
     * desc元素正则匹配
     * @param desc 控件描述
     */
    By.prototype.descMatches = function (desc) {
        this.selector.descriptionMatches = desc;
        return this;
    };
    /**
     * desc元素起始位置相等
     * @param desc 控件描述
     */
    By.prototype.descStartsWith = function (desc) {
        this.selector.descriptionStartsWith = desc;
        return this;
    };
    /**
     * 控件是否可勾选。
     * @param checkable 是否可以点击
     * @constructor
     */
    By.prototype.checkable = function (checkable) {
        this.selector.checkable = checkable;
        return this;
    };
    /**
     * 控件是否可已勾选。
     * @param checked 是否已勾选
     */
    By.prototype.checked = function (checked) {
        this.selector.checked = checked;
        return this;
    };
    /**
     * 控件是否可点击。
     * @param clickable 是否可以点击
     */
    By.prototype.clickable = function (clickable) {
        this.selector.clickable = clickable;
        return this;
    };
    /**
     * 控件是否可长按。
     * @param longClickable
     */
    By.prototype.longClickable = function (longClickable) {
        this.selector.longClickable = longClickable;
        return this;
    };
    /**
     * 控件是否可滑动。
     * @param scrollable
     */
    By.prototype.scrollable = function (scrollable) {
        this.selector.scrollable = scrollable;
        return this;
    };
    /**
     * 控件是否已启用。
     * @param enabled
     */
    By.prototype.enabled = function (enabled) {
        this.selector.enabled = enabled;
        return this;
    };
    /**
     * 控件是否可以聚焦。
     * @param focusable
     */
    By.prototype.focusable = function (focusable) {
        this.selector.focusable = focusable;
        return this;
    };
    /**
     * 控件是否已聚焦
     * @param focused
     */
    By.prototype.focused = function (focused) {
        this.selector.focused = focused;
        return this;
    };
    /**
     * 控件是否已选择。
     * @param selected
     */
    By.prototype.selected = function (selected) {
        this.selector.selected = selected;
        return this;
    };
    /**
     * 包名元素
     * @param pkgName 包名
     */
    By.prototype.packageName = function (pkgName) {
        this.selector.packageName = pkgName;
        return this;
    };
    /**
     * 包名正则匹配
     * @param pkgName 包名
     */
    By.prototype.packageNameMatches = function (pkgName) {
        this.selector.packageNameMatches = pkgName;
        return this;
    };
    /**
     * id元素查找器
     * @param id id元素
     * @constructor
     */
    By.prototype.id = function (id) {
        this.selector.resourceId = id;
        return this;
    };
    /**
     * id 正则
     * @param id
     */
    By.prototype.idMatches = function (id) {
        this.selector.resourceIdMatches = id;
        return this;
    };
    /**
     * 元素下标
     * @param index 下标
     */
    By.prototype.index = function (index) {
        this.selector.index = index;
        return this;
    };
    /**
     * 元素列
     * @param instance
     */
    By.prototype.instance = function (instance) {
        this.selector.instance = instance;
        return this;
    };
    /**
     * 查询单个节点
     * @return 节点信息
     */
    By.prototype.findOne = function () {
        return this.uiselector.findOne(this.selector);
    };
    /**
     * 查询节点集合
     * @return 节点信息集合
     */
    By.prototype.find = function () {
        return this.uiselector.find(this.selector);
    };
    /**
     * 返回节点选择器信息
     */
    By.prototype.getSelector = function () {
        return this.selector;
    };
    return By;
}());
exports.By = By;
var UiSelector = /** @class */ (function () {
    function UiSelector(server) {
        this.server = server;
    }
    /**
     * 查找第一个元素
     */
    UiSelector.prototype.findOne = function (selector) {
        var nodel = null;
        try {
            var info = this.server.Session.When(new Selector_1.Selector(selector)).Info;
            if (info == null)
                return nodel;
            nodel = UiNode_1.UiNode.create(info, this.server.Session);
            return nodel;
        }
        catch (e) {
            return nodel;
        }
    };
    /**
     * 查询节点集合
     * @return 节点信息集合
     */
    UiSelector.prototype.find = function (selector) {
        try {
            var items = this.server.Session.When(new Selector_1.Selector(selector)).FindAll();
            if (items == null)
                return new Array();
            var nodels = null;
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                nodels.push(UiNode_1.UiNode.create(item, this.server.Session));
            }
            return nodels;
        }
        catch (e) {
            return new Array();
        }
    };
    return UiSelector;
}());
exports.UiSelector = UiSelector;