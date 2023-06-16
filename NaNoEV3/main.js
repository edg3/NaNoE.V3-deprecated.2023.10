const { app, BrowserWindow } = require('electron');

function createWindow() {
  // Create the browser window
  const win = new BrowserWindow({
    width: 800,
    height: 600
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