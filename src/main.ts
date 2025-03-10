import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';

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
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();

    // Handle file dialog
    ipcMain.handle('open-file-dialog', async (event, options) => {
        console.log('File dialog requested with options:', options); // Debugging
        try {
            const result = await dialog.showOpenDialog(mainWindow!, {
                properties: ['openFile'], // Allow selecting a file
                ...options, // Merge additional options if provided
            });
            console.log('File dialog result:', result.filePaths); // Debugging
            if (!result.canceled && result.filePaths.length > 0) {
                return result.filePaths[0]; // Return the selected file path
            } else {
                return null; // Return null if no file was selected
            }
        } catch (error) {
            console.error('Error opening file dialog:', error); // Debugging
            throw error; // Re-throw the error to handle it in the renderer process
        }
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