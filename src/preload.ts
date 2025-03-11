import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    encryptFile: () => ipcRenderer.invoke('encrypt-file'),
    decryptFile: () => ipcRenderer.invoke('decrypt-file')
});