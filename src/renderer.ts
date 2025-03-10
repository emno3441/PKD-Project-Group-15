import { ipcRenderer } from 'electron';
import { gameEncryption, gameDecryption } from './logic';

// Add event listeners to the buttons
document.getElementById('encrypt-btn')?.addEventListener('click', async () => {
    console.log('Encrypt button clicked'); // Debugging
    try {
        const filePath = await ipcRenderer.invoke('open-file-dialog');
        if (filePath) {
            console.log('Selected file:', filePath); // Debugging
            await gameEncryption(filePath, './stored_keys.json', 10);
            alert('File encrypted successfully!');
        }
    } catch (error) {
        console.error('Error during encryption:', error); // Debugging
        alert(`Error encrypting file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});

document.getElementById('decrypt-btn')?.addEventListener('click', async () => {
    console.log('Decrypt button clicked'); // Debugging
    try {
        const filePath = await ipcRenderer.invoke('open-file-dialog');
        if (filePath) {
            console.log('Selected file:', filePath); // Debugging
            await gameDecryption(filePath, './stored_keys.json', 10);
            alert('File decrypted successfully!');
        }
    } catch (error) {
        console.error('Error during decryption:', error); // Debugging
        alert(`Error decrypting file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});