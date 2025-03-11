import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { gameEncryption, gameDecryption } from './logic';

let mainWindow: BrowserWindow;

const stored_keys = "./stored_keys.json";

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');
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

// Handle file selection for encryption
ipcMain.handle('encrypt-file', async () => {
    try {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            title: 'Select a file to encrypt',
            filters: [
                { name: 'All Files', extensions: ['*'] }
            ]
        });

        if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            await gameEncryption(filePath, stored_keys, 10);
            return { success: true, message: 'File encrypted successfully.', filePath };
        } else {
            return { success: false, message: 'No file selected.' };
        }
    } catch (error) {
        return { success: false, message: `Error during encryption: ${error}` };
    }
});

// Handle file selection for decryption
ipcMain.handle('decrypt-file', async () => {
    try {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            title: 'Select a file to decrypt',
            filters: [
                { name: 'All Files', extensions: ['*'] }
            ]
        });

        if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            await gameDecryption(filePath, stored_keys, 10);
            return { success: true, message: 'File decrypted successfully.', filePath };
        } else {
            return { success: false, message: 'No file selected.' };
        }
    } catch (error) {
        return { success: false, message: `Error during decryption: ${error}` };
    }
});