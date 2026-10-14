// Renders an HTML file to full-page PNGs (desktop.png, phone.png, desktop-dark.png) and says
// whether the page scrolls sideways, so a walkthrough can be looked at without a browser:
//   <electron.exe> render.cjs <file.html> <out-folder>
// Any Electron binary does, such as a project's node_modules/electron/dist/electron.exe.
const { app, BrowserWindow } = require('electron')
const { writeFileSync } = require('node:fs')
const { join, resolve } = require('node:path')
// loadFile resolves a relative path against the app's folder, not the working directory.
const [file, out] = process.argv.slice(-2).map((path) => resolve(path))
const wait = (ms) => new Promise((done) => setTimeout(done, ms))
app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: 1000, height: 900, webPreferences: { offscreen: true } })
  await win.loadFile(file)
  for (const [name, width, theme] of [['desktop', 1000, 'light'], ['phone', 390, 'light'], ['desktop-dark', 1000, 'dark']]) {
    await win.webContents.executeJavaScript(`document.documentElement.dataset.theme = '${theme}'`)
    win.setContentSize(width, 900)
    await wait(400)
    const height = await win.webContents.executeJavaScript('document.documentElement.scrollHeight')
    const overflow = await win.webContents.executeJavaScript('document.documentElement.scrollWidth > document.documentElement.clientWidth')
    win.setContentSize(width, Math.min(height, 12000))
    await wait(400)
    writeFileSync(join(out, `${name}.png`), (await win.webContents.capturePage()).toPNG())
    console.log(name, width, 'x', height, overflow ? 'HORIZONTAL OVERFLOW' : 'no overflow', height > 12000 ? '(cut at 12000)' : '')
  }
  app.quit()
}).catch((error) => { console.error(error); app.exit(1) })
