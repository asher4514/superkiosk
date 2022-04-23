// Modules to control application life and create native browser window
/* Start Of Config */
const url = "https://google.com"
let production = true;
const password = "password"
/* End Of Config */
require('@electron/remote/main').initialize()


const { app, BrowserWindow, globalShortcut } = require('electron')
var shell = require('shelljs');
if (production) {
  shell.exec('xfce4-panel -q');
}
const path = require('path')

function createWindow() {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    show: false,
    closable: false,
    frame: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  })
  require('@electron/remote/main').enable(mainWindow.webContents)


  let ret = globalShortcut.register('Control+I', () => {
    if (mainWindow !== null) {
      mainWindow.loadFile('admin.html')
    }
  })

  mainWindow.maximize()
  mainWindow.show()
  mainWindow.setFullScreen(true)
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  if (production) {
    mainWindow.on('close', function () { //   <---- Catch close event

      if (production) {
        return app.relaunch();
      }

    });
    app.on('browser-window-blur', (event, win) => {
      if (mainWindow == null) { return; }
      mainWindow.focus()
    })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})





// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

exports.disable = function (e) {
  if (e == password) {
    production = false;
    shell.exec('xfce4-panel -r');
    app.quit()
  } else {
    return false;
  }
}

exports.url = url;

exports.relaunch = function () {
  app.quit()
}