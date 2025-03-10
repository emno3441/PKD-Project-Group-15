import { ipcRenderer } from 'electron';
import { gameEncryption, gameDecryption } from './logic';

document.getElementById('encrypt-btn')?.addEventListener('click', async () => {
    console.log('Encrypt button clicked'); // Debugging
    try {
        const filePath = await ipcRenderer.invoke('open-file-dialog', {
            title: 'Select a file to encrypt', // Custom dialog title
            filters: [
                { name: 'All Files', extensions: ['*'] }, // File filters
            ],
        });
        console.log('File path selected:', filePath); // Debugging
        if (filePath) {
            await gameEncryption(filePath, './stored_keys.json', 10);
            alert('File encrypted successfully!');
        } else {
            console.log('No file selected.'); // Debugging
        }
    } catch (error) {
        console.error('Error during encryption:', error); // Debugging
        alert(`Error encrypting file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});

document.getElementById('decrypt-btn')?.addEventListener('click', async () => {
    console.log('Decrypt button clicked'); // Debugging
    try {
        const filePath = await ipcRenderer.invoke('open-file-dialog', {
            title: 'Select a file to decrypt', // Custom dialog title
            filters: [
                { name: 'All Files', extensions: ['*'] }, // File filters
            ],
        });
        console.log('File path selected:', filePath); // Debugging
        if (filePath) {
            await gameDecryption(filePath, './stored_keys.json', 10);
            alert('File decrypted successfully!');
        } else {
            console.log('No file selected.'); // Debugging
        }
    } catch (error) {
        console.error('Error during decryption:', error); // Debugging
        alert(`Error decrypting file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});