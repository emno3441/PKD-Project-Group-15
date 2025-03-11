// Ensure TypeScript knows about the `electron` property on the `window` object
interface Window {
    electron: {
        encryptFile: () => Promise<{ success: boolean; message: string; filePath?: string }>;
        decryptFile: () => Promise<{ success: boolean; message: string; filePath?: string }>;
    };
}

// Helper function to update the status message in the UI
function updateStatus(message: string): void {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

// Handle the "Encrypt File" button click
document.getElementById('encryptBtn')?.addEventListener('click', async () => {
    try {
        // Confirm the user's intention to encrypt a file
        const confirmEncrypt = confirm('Are you sure you want to encrypt a file?');
        if (!confirmEncrypt) {
            updateStatus('Encryption canceled.');
            return;
        }

        // Show a loading message while the file dialog is open
        updateStatus('Opening file dialog...');

        // Call the main process to open the file dialog and encrypt the file
        const result = await window.electron.encryptFile();

        // Update the UI with the result
        if (result.success) {
            updateStatus(`File encrypted successfully. File: ${result.filePath}`);
        } else {
            updateStatus(`Encryption failed: ${result.message}`);
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error during encryption:', error);
        updateStatus('An unexpected error occurred during encryption.');
    }
});

// Handle the "Decrypt File" button click
document.getElementById('decryptBtn')?.addEventListener('click', async () => {
    try {
        // Confirm the user's intention to decrypt a file
        const confirmDecrypt = confirm('Are you sure you want to decrypt a file?');
        if (!confirmDecrypt) {
            updateStatus('Decryption canceled.');
            return;
        }

        // Show a loading message while the file dialog is open
        updateStatus('Opening file dialog...');

        // Call the main process to open the file dialog and decrypt the file
        const result = await window.electron.decryptFile();

        // Update the UI with the result
        if (result.success) {
            updateStatus(`File decrypted successfully. File: ${result.filePath}`);
        } else {
            updateStatus(`Decryption failed: ${result.message}`);
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error during decryption:', error);
        updateStatus('An unexpected error occurred during decryption.');
    }
});