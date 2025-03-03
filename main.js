"use strict";
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
app.whenReady().then(function () {
    var myWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webpreferences: {
            nodeintegration: true
        }
    });
    myWindow.loadFile('index.html');
});
