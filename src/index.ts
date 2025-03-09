import { app, BrowserWindow } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'main/preload.ts'), // Path to preload script
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // Load the renderer's HTML file
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

    // Open DevTools (optional)
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});