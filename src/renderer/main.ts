const { ipcRenderer } = require('electron');

document.getElementById('navigateButton').addEventListener('click', async () => {
    const inputData = document.getElementById('labyrinthInput').value;
    try {
        const result = await ipcRenderer.invoke('navigate-labyrinth', inputData);
        document.getElementById('result').innerText = result;
    } catch (error) {
        document.getElementById('result').innerText = `Error: ${error.message}`;
    }
});