//import { Ui } from "./uiautomator2/Api/Ui";

var Ui = require("./uiautomator2/Api/Ui").Ui;
//print(Ui.App().AppStart("cn.weli.story"));
//print(Ui.App().CurrentApp())

//重启app
print(Ui.App().AppStart("cn.weli.story", "cn.etouch.ecalendar.MainActivity", true, true));