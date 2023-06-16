const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path");

const sqlite3 = require('sqlite3');

const dbHistory = new sqlite3.Database('history.nne3');

var pastNovels = ['none'];

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

    dbHistory.run('CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, filepath TEXT)');
    //dbHistory.run('INSERT INTO history(name, filepath) VALUES (\'test\',\'test\')');

    var outRows = null;
    dbHistory.all('SELECT * FROM history', (err, rows) => {
        // console.log(err);
        // console.log(rows);
        if (err) {
            console.log(err.message);
        }
        else {
            outRows = rows;
        }
    });

    setTimeout(() => {
        if (outRows !== null) {
            if (outRows.length > 0) {
                dbHistory.each("SELECT * FROM history ORDER BY id DESC", (err, row) => {
                    if (err) {
                        console.log('Error: couldn\'t get rows');
                    }
                    else {
                        pastNovels.push(...[row]);
                    }
                });
            }
        }
    }, 100);

    setTimeout(() => {
        if (pastNovels.length > 1) {
            pastNovels.shift();
        }
        console.log(pastNovels);

        // Load the index.html file
        win.loadFile('index.html');
    }, 200);
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
    dbHistory.close();

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