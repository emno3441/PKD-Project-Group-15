import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    navigateLabyrinth: (inputData: string) => ipcRenderer.invoke('navigate-labyrinth', inputData),
});