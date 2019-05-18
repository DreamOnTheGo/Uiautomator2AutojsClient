var UIAutomatorServer_1 = require("../Base/UIAutomatorServer");
var By_1 = require("./By");
var Shell_1 = require("./Shell");
var Xpath_1 = require("./Xpath");
var App_1 = require("./App");
var Ui = /** @class */ (function () {
    function Ui() {
    }
    /**
     * 一个选择器实例
     * @constructor
     */
    Ui.Selector = function () {
        return new By_1.By(this.server);
    };
    /**
     * xpath查找节点
     * @constructor
     */
    Ui.Xpath = function () {
        return new Xpath_1.Xpath();
    };
    /**
     * shell命令
     * @constructor
     */
    Ui.Shell = function () {
        return this.shell;
    };
    /**
     * app信息类
     * @constructor
     */
    Ui.App = function () {
        return this.app;
    };
    Ui.server = new UIAutomatorServer_1.UIAutomatorServer();
    Ui.shell = new Shell_1.Shell(Ui.server);
    Ui.app = new App_1.App(Ui.server);
    return Ui;
}());
exports.Ui = Ui;
