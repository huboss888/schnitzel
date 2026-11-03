---
name: feature-walkthrough
description: Make a short step-by-step walkthrough of how one program feature is used (legacy WinForms, Electron, or a web page), with a screenshot per step, as a self-contained HTML page or, on request, a Word file, either for a reader deciding something about the feature without running it, or for a reader who will do the steps in their own dev instance. Use only when explicitly invoked.
disable-model-invocation: true
compatibility: Requires Node.js 18+ to build the page. Word output also needs the docx npm package, installed under .scratch/. Rendering the page for a check uses any Electron binary, or a browser.
---

# Feature walkthrough

A walkthrough shows one feature the way a user meets it: open it, fill it in, act, see the result, one
screenshot per step, with a sentence or three of what happens and why it matters. It has two modes:

- **Decision mode**, for someone deciding something about the feature (an owner, a PM, a reviewer),
  who will not run the program.
- **Usage mode**, for someone who will do the steps themselves, in their own dev instance.

## 1. Pin down the feature, the mode, and the question

Before capturing anything, know:

- **which feature**: the screen and the menu path, and the code behind it. Read the code first;
  it tells you which controls exist, what each step does, and which step writes data or starts
  another program;
- **which mode**: decision when the reader will not run the program, usage when they will. Ask
  when the request does not say;
- **why the reader wants it**: in decision mode, the decision or question it serves (an issue
  number, "does legacy do X?"), and the walkthrough leads with the answer to that question; in
  usage mode, the task the reader wants to get done;
- **language**: write in the reading language the Language section of `docs/agents/coding.md`
  records (Traditional Chinese when it is absent), and quote screen text exactly as the program
  shows it.

## 2. Capture

Capture **from the program itself**, never the screen: draw the window or page into an image. This
works while the window is hidden, never picks up the user's desktop or other windows, and gives
the same picture every run. How depends on what the program is; read the matching reference:

| Program | Reference |
|---|---|
| Legacy .NET WinForms, driven from PowerShell | [references/capture-winforms.md](references/capture-winforms.md) |
| An Electron app driven by Playwright | [references/capture-electron.md](references/capture-electron.md) |
| A web page | the browser tool's screenshot of the page or of one element; no reference needed |

For any of them:

- **Use scratch data.** Start the program the way its project's verification skill says, on an
  isolated `SCRATCH_` instance with the verification fixtures. A repo's `AGENTS.md` and
  verification skill own how to launch it and load them; follow them, do not restate them here.
  In usage mode, when those fixtures lack data for the feature, build it there by driving the
  project's own harness scripts or the app's screens, and say so in the walkthrough. Never write
  to the person's dev instance.
- **Which steps run.** In decision mode, stop before a step that writes data or opens another
  program (saving, exporting, starting Excel, sending, printing): picture the screen just before
  it, and describe the step from the code, marked as read from source. In usage mode, run and
  show the steps that save, export, or import, on the isolated instance, with exported files
  written under `.scratch/walkthroughs/`; only a step that leaves the machine (sending, printing,
  an external service) is described from source. In both modes, follow the capture reference for
  a step that would open another program's window: the run cannot close it.
- **Prerequisites from elsewhere.** In usage mode, state a prerequisite that belongs to another
  module or program in one line (the data it needs, or the feature it depends on), not as a
  walk through the whole chain.
- **One picture per step the reader needs**, at the moment the step's effect is visible: the
  screen as it opens, after the choices that change it, all filled in. Skip intermediate states
  that look the same.
- **Picture what the step is about, not the whole window**: the menu bar for "choose this menu",
  the form for "fill it in". A mostly empty main window shrinks what matters to a strip.
- **Pick data that shows the feature**: a record that has the fields filled, a structure with
  sections. If a part of the screen stays empty or disabled because of the data, say so under the
  picture rather than letting the reader think the feature lacks it.
- **Record what the run saw** beside the pictures (list contents, labels, messages) in a log; the
  text of the walkthrough is checked against it.
- **Clean up** what the capture made: stop the program and remove its `SCRATCH_` databases and
  leftover program state. One-off step scripts, pictures, and the log stay under
  `.scratch/walkthroughs/`; they are not committed unless asked.

## 3. Write

Keep it short; the pictures carry it. The shape:

1. **Title** and one line saying what program, which feature and which question or task.
2. **Conclusion first** (decision mode): two to four bullets that answer the reader's question.
   **Before you start** (usage mode): the prerequisites, one line each.
3. **Steps**: a heading per step ("步驟 2：選專案"), one to three sentences or bullets, the picture,
   a caption. Name controls as the screen does.
4. **What happens next** for the steps not run, marked as read from source (say the source may
   differ from the build when that is so).
5. **A table** where it helps (options to outputs, fields to columns).
6. **What it means for the question** (decision mode), with the options when a decision is open.
   **What you end with** (usage mode): the saved or exported result, as the run showed it.

Keep **observed** and **read from source** apart throughout: the reader will act on it. Say what
the test data lacked. Do not pad with feature history or general explanations.

## 4. Build the page

Write the content as a small outline file and build it with the bundled script rather than writing
HTML by hand, so every walkthrough has the same layout, light and dark themes, and embedded
images:

```
node <absolute-skill-path>/scripts/build.mjs <outline.json> --html <out.html> [--docx <out.docx>]
```

If Node is missing, report it as the prerequisite rather than writing the page by hand.
[references/outline.md](references/outline.md) gives the outline format. The HTML is one file with
the images inside it (base64) and no outside resources, with light and dark themes and a layout
that fits a phone, so it opens in any browser and can be published as a hosted page as it is. Word
is built only when asked: `--docx` needs the `docx` npm package, which the script tells you how to
install under `.scratch/`, never into the project's dependencies.

## 5. Check, then deliver

- Look at the page before handing it over: every picture, the phone width, the dark theme.
  Open it in a browser tool that can show a local file, or render it with
  `<electron> <absolute-skill-path>/scripts/render.cjs <out.html> <folder>` (any Electron binary,
  such as a project's `node_modules/electron/dist/electron.exe`) and read the PNGs it writes; it
  also says whether the page scrolls sideways. When neither is available, say the page was not
  looked at.
- For a Word file, render it if Word or LibreOffice is there; otherwise check its text and images
  and tell the reader the layout was not seen.
- Check every claim against the code or the capture log, especially "there is no X".
- Write the outline, the page, and any Word file under `.scratch/walkthroughs/<feature>/` in the
  project, not a temp folder, send it, and say what was observed, what was read from source, and
  what the data could not show.
