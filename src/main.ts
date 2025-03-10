import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path'; // Use default import syntax

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // Load the index.html file
    mainWindow.loadFile(path.join(__dirname, '../../index.html'));

    // Open DevTools (for debugging)
    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();

    // Handle file dialog
    ipcMain.handle('open-file-dialog', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
        });
        return result.filePaths[0]; // Return the selected file path
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});