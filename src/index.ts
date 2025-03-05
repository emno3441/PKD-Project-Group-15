import {app, ipcMain, BrowserWindow} from "electron";

let mainWindow : BrowserWindow;

app.on("ready", createwindows);

function createwindows (): void {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            preload: __dirname + "/preload.js"
        },
        show: false
    })
    
    mainWindow.loadFile("./index.html")
    mainWindow.on("ready-to-show", () => mainWindow.show())
}