const { contextBridge, ipcRenderer } = require('electron');

// Expose select Electron APIs to the renderer process
contextBridge.exposeInMainWorld(
    'api', {
        send: (channel,data) => {
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
    }
);