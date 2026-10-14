# Capturing a legacy WinForms program

Legacy .NET WinForms programs are driven from PowerShell: load the program's assembly, show its
main form, open forms through their menu items, and set controls directly. When the project's
verification skill has a harness that does this (helpers to open a form, find a control by name,
click, pump messages, log, and close stray dialogs), use it; that skill also says how to give it a
scratch database. The examples below call such helpers as `Fld` (a control by name), `Pump` (let
the form process messages for a while), `Say` (write a log line) and `AllControls`; use the
harness's own names, or write the few you need. Write a one-off step script in the session's
scratch folder, run it, and delete it afterwards.

## Drawing a form

```powershell
function Shot($control, $name) {
    $bmp = New-Object Drawing.Bitmap $control.Width, $control.Height
    $control.DrawToBitmap($bmp, (New-Object Drawing.Rectangle 0, 0, $control.Width, $control.Height))
    $bmp.Save((Join-Path $Shots "$name.png"), [Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
}
```

`DrawToBitmap` asks each control to paint itself into the image, so it works with the window
hidden or covered. Give the main form a fixed size first (`$main.WindowState = 'Normal'; $main.Size
= New-Object Drawing.Size 1100, 700`) so pictures are the same each run, and `Pump` a few hundred
milliseconds after each change so the form has repainted.

`DrawToBitmap` works on any control, not only a form: draw the `MenuStrip` for a menu path, a
`GroupBox` for one part of a form. Use that rather than a whole window that is mostly empty.

What it does not draw:

- **open dropdown menus and combo box lists**: they are separate windows. Show the menu path in
  the text, and list a combo box's items from `.Items` in the log instead;
- **message boxes and the Windows file, folder and copy dialogs**: they belong to Windows. Do not
  trigger them; set the field a dialog would fill instead;
- controls that draw themselves with native code (some charts, embedded browsers or players) may
  come out blank. Say so under the picture.

## Steps that must not run

- Anything that starts **Excel** or another Office program (report output, Excel import): it opens
  windows on the user's desktop and may wait for them. Stop before it; describe it from source.
- Anything that **copies files** with `My.Computer.FileSystem.CopyFile(..., UIOption.AllDialogs)`:
  if the target exists from an earlier run, Windows shows its "Replace or Skip" dialog and the run
  waits. Empty the target folder in the scratch data folder first.
- Saving: only on scratch data, and only when the walkthrough is about saving.

## Logging what the screen shows

Write the lists and labels the reader will see into the log, for checking the text against:

```powershell
Say "projects: $(@((Fld $form 'Cbproj1').Items | ForEach-Object { "$_" }) -join ' | ')"
Say "controls: $(@(AllControls $form | Where-Object { $_ -is [Windows.Forms.GroupBox] -or $_ -is [Windows.Forms.CheckBox] } | ForEach-Object { "$($_.Name)=$($_.Text)" }) -join ' | ')"
```

A menu item's place in the menu bar: `"$($item.OwnerItem.Text) > $($item.Text)"`.
