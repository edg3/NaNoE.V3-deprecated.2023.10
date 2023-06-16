const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path");

function createWindow() {
    // Create the browser window
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        resizable: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, "preload.js")
        },
    });

    // Load the index.html file
    win.loadFile('index.html');
}

// When the app is ready, create the window
app.whenReady().then(() => {
    createWindow();

    // On macOS, create the window again when the dock icon is clicked
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit the app when all windows are closed, except on macOS
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Create events to/from Main:
ipcMain.on('toMain', (event, args) => {
    var spltArgs = ('' + args).split('|');
    switch (spltArgs[0]) {
        case 'exit':
            app.quit();
            break;
        case 'debug':
            console.log(spltArgs[1]);
            break;
    }
});