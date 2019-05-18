var Selector = /** @class */ (function () {
    function Selector(obj) {
        this.text = obj.text;
        this.textContains = obj.textContains;
        this.textMatches = obj.textMatches;
        this.textStartsWith = obj.textStartsWith;
        /**className */
        this.className = obj.className;
        this.classNameMatches = obj.classNameMatches;
        this.description = obj.description;
        this.descriptionContains = obj.descriptionContains;
        this.descriptionMatches = obj.descriptionMatches;
        this.descriptionStartsWith = obj.descriptionStartsWith;
        this.checkable = obj.checkable;
        this.checked = obj.checked;
        this.clickable = obj.clickable;
        this.longClickable = obj.longClickable;
        this.scrollable = obj.scrollable;
        this.enabled = obj.enabled;
        this.focusable = obj.focusable;
        this.focused = obj.focused;
        this.selected = obj.selected;
        this.packageName = obj.packageName;
        this.packageNameMatches = obj.packageNameMatches;
        this.resourceId = obj.resourceId;
        this.resourceIdMatches = obj.resourceIdMatches;
        this.index = obj.index;
        this.instance = obj.instance;
        this.childOrSiblingSelector = new Array();
        this.childOrSibling = new Array();
        this.mask = Selector.init(obj);
    }
    Selector.init = function (obj) {
        var _mask = 0;
        if (obj.text != undefined) {
            _mask += Selector.MASK_TEXT;
        }
        if (obj.textContains != undefined) {
            _mask += Selector.MASK_TEXTCONTAINS;
        }
        if (obj.textMatches != undefined) {
            _mask += Selector.MASK_TEXTMATCHES;
        }
        if (obj.textStartsWith != undefined) {
            _mask += Selector.MASK_TEXTSTARTSWITH;
        }
        if (obj.className != undefined) {
            _mask += Selector.MASK_CLASSNAME;
        }
        if (obj.classNameMatches != undefined) {
            _mask += Selector.MASK_CLASSNAMEMATCHES;
        }
        if (obj.description != undefined) {
            _mask += Selector.MASK_DESCRIPTION;
        }
        if (obj.descriptionContains != undefined) {
            _mask += Selector.MASK_DESCRIPTIONCONTAINS;
        }
        if (obj.descriptionMatches != undefined) {
            _mask += Selector.MASK_DESCRIPTIONMATCHES;
        }
        if (obj.descriptionStartsWith != undefined) {
            _mask += Selector.MASK_DESCRIPTIONSTARTSWITH;
        }
        if (obj.checkable != undefined) {
            _mask += Selector.MASK_CHECKABLE;
        }
        if (obj.checked != undefined) {
            _mask += Selector.MASK_CHECKED;
        }
        if (obj.clickable != undefined) {
            _mask += Selector.MASK_CLICKABLE;
        }
        if (obj.longClickable != undefined) {
            _mask += Selector.MASK_LONGCLICKABLE;
        }
        if (obj.scrollable != undefined) {
            _mask += Selector.MASK_SCROLLABLE;
        }
        if (obj.enabled != undefined) {
            _mask += Selector.MASK_ENABLED;
        }
        if (obj.focusable != undefined) {
            _mask += Selector.MASK_FOCUSABLE;
        }
        if (obj.focused != undefined) {
            _mask += Selector.MASK_FOCUSED;
        }
        if (obj.selected != undefined) {
            _mask += Selector.MASK_SELECTED;
        }
        if (obj.packageName != undefined) {
            _mask += Selector.MASK_PACKAGENAME;
        }
        if (obj.packageNameMatches != undefined) {
            _mask += Selector.MASK_PACKAGENAMEMATCHES;
        }
        if (obj.resourceId != undefined) {
            _mask += Selector.MASK_RESOURCEID;
        }
        if (obj.resourceIdMatches != undefined) {
            _mask += Selector.MASK_RESOURCEIDMATCHES;
        }
        if (obj.index != undefined) {
            _mask += Selector.MASK_INDEX;
        }
        if (obj.instance != undefined) {
            _mask += Selector.MASK_INSTANCE;
        }
        return _mask;
    };
    /**
     * 克隆
     */
    Selector.prototype.clone = function () {
        var selector = new Selector(this);
        selector.mask = 0;
        selector.childOrSibling = new Array();
        selector.childOrSiblingSelector = new Array();
        for (var i = 0; i < this.childOrSibling.length; i++) {
            var childOrSibling = this.childOrSibling[i];
            selector.childOrSibling.push(childOrSibling);
        }
        for (var i = 0; i < this.childOrSiblingSelector.length; i++) {
            var childOrSiblingSelector = this.childOrSiblingSelector[i];
            var child = childOrSiblingSelector.clone();
            selector.childOrSiblingSelector.push(child);
        }
        return selector;
    };
    ;
    /**
     * 查询子集
     * @param obj 选择器
     * @return 选择器
     */
    Selector.prototype.child = function (obj) {
        this.childOrSibling.push("child");
        this.childOrSiblingSelector.push(new Selector(obj));
        return this;
    };
    ;
    Selector.prototype.sibling = function (obj) {
        this.childOrSibling.push("sibling");
        this.childOrSiblingSelector.push(new Selector(obj));
        return this;
    };
    Selector.prototype.update_instance = function (i) {
        if (this.childOrSiblingSelector.length > 0) {
            this.childOrSiblingSelector[this.childOrSiblingSelector.length - 1].instance = i;
        }
        else {
            this.instance = i;
        }
    };
    Selector.MASK_TEXT = 0x01;
    Selector.MASK_TEXTCONTAINS = 0x02;
    Selector.MASK_TEXTMATCHES = 0x04;
    Selector.MASK_TEXTSTARTSWITH = 0x08;
    Selector.MASK_CLASSNAME = 0x10;
    Selector.MASK_CLASSNAMEMATCHES = 0x20;
    Selector.MASK_DESCRIPTION = 0x40;
    Selector.MASK_DESCRIPTIONCONTAINS = 0x80;
    Selector.MASK_DESCRIPTIONMATCHES = 0x0100;
    Selector.MASK_DESCRIPTIONSTARTSWITH = 0x0200;
    Selector.MASK_CHECKABLE = 0x0400;
    Selector.MASK_CHECKED = 0x0800;
    Selector.MASK_CLICKABLE = 0x1000;
    Selector.MASK_LONGCLICKABLE = 0x2000;
    Selector.MASK_SCROLLABLE = 0x4000;
    Selector.MASK_ENABLED = 0x8000;
    Selector.MASK_FOCUSABLE = 0x010000;
    Selector.MASK_FOCUSED = 0x020000;
    Selector.MASK_SELECTED = 0x040000;
    Selector.MASK_PACKAGENAME = 0x080000;
    Selector.MASK_PACKAGENAMEMATCHES = 0x100000;
    Selector.MASK_RESOURCEID = 0x200000;
    Selector.MASK_RESOURCEIDMATCHES = 0x400000;
    Selector.MASK_INDEX = 0x800000;
    Selector.MASK_INSTANCE = 0x01000000;
    return Selector;
}());
exports.Selector = Selector;
var SelectorParam = /** @class */ (function () {
    function SelectorParam() {
    }
    return SelectorParam;
}());
exports.SelectorParam = SelectorParam;
