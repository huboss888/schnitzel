# Capturing an Electron app with Playwright

Electron apps are driven with Playwright's Electron driver (`_electron.launch` from `playwright`,
which returns the app; `app.firstWindow()` gives the page). When the project's verification skill
has a launcher that starts the built app on a scratch database, use it; that skill also says how to
make the database and build first. Write a one-off script in the session's scratch folder,
importing the launcher by its path, and delete it afterwards.

## Taking the picture

```js
await page.setViewportSize({ width: 1280, height: 800 })      // the same size every run
await page.screenshot({ path: join(shots, '2-opened.png') })   // the whole window's page
await page.locator('section').first().screenshot({ path: join(shots, '3-form.png') }) // one part
```

The screenshot is drawn by the page itself, so it works with the window hidden or covered. Wait
for the screen to settle before each one: the data to load (no spinner), menus to close. Turning
transitions off (`page.addStyleTag({ content: '* { transition: none !important; animation: none
!important; }' })`, unless the launcher already does) keeps pictures from catching things halfway.

Showing state that only exists while open (a dropdown, a select's options, a tooltip): open it and
take the picture before closing it; Playwright screenshots do include page-drawn popups such as
Naive UI menus, unlike WinForms.

## What never appears

- **Operating-system windows**: file and folder pickers, save dialogs, `window.confirm` and
  `alert` boxes. Stub them before the step (replace `dialog.showOpenDialog` and the other
  `dialog` methods through `app.evaluate`, and answer `window.confirm` with `page.on('dialog')`),
  or use the launcher's stubs when it has them, so there is nothing to photograph. Describe the
  question in the text, with its wording from the code.
- **Files opened in other programs** (`shell.openPath`): stub `shell.openPath` and say what would
  open.
- **Native menus** (the Electron menu bar, context menus built with `Menu`). Name them in the text.

## Steps that must not run

Run saving only on scratch data, and exports only into a scratch folder. Never let a step open a
real dialog: an OS window the script cannot see makes the run hang.
