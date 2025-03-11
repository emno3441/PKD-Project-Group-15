Stating the program
----------------
- npm install
- npm build
- node ./dist/src/main.js

Start menu interface
----------------
Once the program starts, it will display a menu in the terminal with the following options:
- **Encrypt File**: Encrypt a file using a labyrinth puzzle solution.
- **Decrypt File**: Decrypt a file by solving the associated labyrinth.
- **Cancel**: Exit the program.

Encrypting a File
----------------
Follow these steps to encrypt a file:
1. Select **"Encrypt File"** from the menu.
2. Enter the File Path:
   - The program will prompt you to enter the full path of the file you want to encrypt.
3. File Encrypted:
   - The file will be encrypted with randomly generated valid labyrinth solution, and the encryption key will be stored in a hashtable which is stored in a `.json` file.

Example:
- You select `Encrypt File`.
- You enter the file path: `C:/Windows/System32/winload.exe`.
- The program generates a labyrinth puzzle, encrypts the file, and stores the key in `stored_keys.json` and your PC would not boot correctly.

Decrypting a File
----------------
Follow these steps to decrypt a file:
1. Select **"Decrypt File"** from the menu.
2. Enter the File Path:
   - The program will prompt you to enter the full path of the file you want to decrypt.
3. Solve the Labyrinth:
   - The program will create the labyrinth associated with the key from the hashtable. Solve the labyrinth to decrypt the file.
4. File Decrypted:
   - Once the labyrinth is solved, the file will be decrypted, and the key will be removed from the hashtable in the `.json` file.

Example:
- You select `Decrypt File`.
- You enter the file path: `C:/Windows/System32/winload.exe`.
- The program retrieves the labyrinth solution from `stored_keys.json` and generates a labyrinth based on it. After solving it, the file is decrypted back to the original `winload.exe` and now will your PC boot properly again.