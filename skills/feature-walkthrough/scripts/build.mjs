#!/usr/bin/env node
// Builds a feature walkthrough from an outline (see references/outline.md):
//   node build.mjs <outline.json> --html <out.html> [--docx <out.docx>]
// The HTML is one file with its images inside (base64) with light and dark themes, so it can be hosted as it is.
// --docx needs the `docx` npm package; when it cannot be found the script says how to install it
// into a scratch folder (never into a project).
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, extname, resolve } from 'node:path'

const args = process.argv.slice(2)
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null)
const outlinePath = args.find((arg) => !arg.startsWith('--') && arg !== flag('--html') && arg !== flag('--docx'))
if (!outlinePath || (!flag('--html') && !flag('--docx'))) {
  console.error('usage: node build.mjs <outline.json> --html <out.html> [--docx <out.docx>]')
  process.exit(2)
}
const outline = JSON.parse(readFileSync(outlinePath, 'utf8').replace(/^﻿/, ''))
const base = dirname(resolve(outlinePath))
const chinese = /^zh/i.test(outline.lang ?? '')
const labels = {
  summary: chinese ? '結論' : 'In short',
  source: chinese ? '依原始碼，未實際執行' : 'From the source, not run',
  observed: chinese ? '實際操作' : 'Observed',
  ...outline.labels
}
const sections = outline.sections ?? []

/** An image file as bytes, with its type and pixel size (PNG and JPEG). */
function picture(path) {
  const type = { '.png': 'png', '.jpg': 'jpg', '.jpeg': 'jpg' }[extname(path).toLowerCase()]
  if (!type) throw new Error(`${path}: only PNG and JPEG pictures are supported`)
  const bytes = readFileSync(resolve(base, path))
  let width = 800, height = 600
  if (type === 'png') {
    width = bytes.readUInt32BE(16)
    height = bytes.readUInt32BE(20)
  } else {
    for (let at = 2; at < bytes.length; ) {
      const marker = bytes[at + 1], length = bytes.readUInt16BE(at + 2)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        height = bytes.readUInt16BE(at + 5)
        width = bytes.readUInt16BE(at + 7)
        break
      }
      at += 2 + length
    }
  }
  return { bytes, type, width, height }
}

// ---- HTML ------------------------------------------------------------------------------------------
const escape = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const inline = (text) => escape(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>')
const list = (items) => (items?.length ? `<ul>${items.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>` : '')
const paragraphs = (items) => (items ?? []).map((item) => `<p>${inline(item)}</p>`).join('')
const table = (t) => !t ? '' : `<div class="table"><table><thead><tr>${t.headers.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${
  t.rows.map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
function figure(step) {
  if (!step.image) return ''
  const { bytes, type, width, height } = picture(step.image)
  const mime = type === 'png' ? 'image/png' : 'image/jpeg'
  return `<figure><img src="data:${mime};base64,${bytes.toString('base64')}" width="${width}" height="${height}" alt="${escape(step.caption ?? step.title ?? '')}">${
    step.caption ? `<figcaption>${inline(step.caption)}</figcaption>` : ''}</figure>`
}
const tag = (step) => step.source ? `<span class="tag source">${escape(labels.source)}</span>` : step.observed ? `<span class="tag">${escape(labels.observed)}</span>` : ''
const stepHtml = (step) => `<article class="step"><h3>${inline(step.title ?? '')}${tag(step)}</h3>${paragraphs(step.text)}${list(step.bullets)}${figure(step)}</article>`
const sectionHtml = (section) => `<section>${section.heading ? `<h2>${inline(section.heading)}</h2>` : ''}${paragraphs(section.paragraphs)}${list(section.bullets)}${
  (section.steps ?? []).map(stepHtml).join('')}${table(section.table)}</section>`

function html() {
  const fonts = chinese
    ? '"Microsoft JhengHei", "PingFang TC", "Noto Sans TC", system-ui, sans-serif'
    : 'system-ui, -apple-system, "Segoe UI", sans-serif'
  return `<!doctype html>
<html lang="${escape(outline.lang ?? 'en')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(outline.title)}</title>
<style>
:root { --bg: #f7f7f5; --surface: #ffffff; --text: #1f2328; --muted: #5f6670; --line: #d9dce1; --accent: #2f5d8c; --tag: #8a5a00; --tag-bg: #fff3d6; --head: #eef2f6; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #16181b; --surface: #1e2125; --text: #e6e8eb; --muted: #a0a7b0; --line: #353a40; --accent: #8fb6e0; --tag: #f0c46b; --tag-bg: #3a2f17; --head: #262a30; } }
:root[data-theme="dark"] { --bg: #16181b; --surface: #1e2125; --text: #e6e8eb; --muted: #a0a7b0; --line: #353a40; --accent: #8fb6e0; --tag: #f0c46b; --tag-bg: #3a2f17; --head: #262a30; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.7 ${fonts}; }
main { max-width: 860px; margin: 0 auto; padding: 32px 16px 64px; }
h1 { font-size: 1.7rem; line-height: 1.3; margin: 0 0 6px; }
.subtitle { color: var(--muted); margin: 0 0 24px; }
h2 { font-size: 1.25rem; color: var(--accent); margin: 36px 0 12px; padding-bottom: 6px; border-bottom: 1px solid var(--line); }
h3 { font-size: 1.05rem; margin: 0 0 8px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.summary { background: var(--surface); border: 1px solid var(--line); border-left: 4px solid var(--accent); border-radius: 8px; padding: 12px 18px; }
.summary h2 { margin: 0 0 4px; border: 0; padding: 0; font-size: 1rem; }
.step { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 16px 18px; margin: 14px 0; }
.tag { font-size: 0.75rem; font-weight: normal; border-radius: 999px; padding: 1px 10px; background: var(--head); color: var(--muted); }
.tag.source { background: var(--tag-bg); color: var(--tag); }
p { margin: 0 0 8px; }
ul { margin: 0 0 8px; padding-left: 1.3em; }
code { font-family: Consolas, "SFMono-Regular", monospace; font-size: 0.9em; background: var(--head); padding: 0 4px; border-radius: 4px; }
figure { margin: 12px 0 0; text-align: center; }
figure img { max-width: 100%; height: auto; border: 1px solid var(--line); border-radius: 4px; background: #fff; cursor: zoom-in; }
figure.zoom { overflow-x: auto; text-align: left; }
figure.zoom img { max-width: none; cursor: zoom-out; }
figcaption { color: var(--muted); font-size: 0.85rem; margin-top: 4px; }
.table { overflow-x: auto; margin: 12px 0; }
table { border-collapse: collapse; width: 100%; background: var(--surface); font-size: 0.95rem; }
th, td { border: 1px solid var(--line); padding: 6px 10px; text-align: left; vertical-align: top; }
th { background: var(--head); }
</style>
</head>
<body>
<main>
<h1>${inline(outline.title)}</h1>
${outline.subtitle ? `<p class="subtitle">${inline(outline.subtitle)}</p>` : ''}
${outline.summary?.length ? `<div class="summary"><h2>${escape(labels.summary)}</h2>${list(outline.summary)}</div>` : ''}
${sections.map(sectionHtml).join('\n')}
</main>
<script>
// A picture shows at full size, scrolling sideways, while tapped; tap again to fit it.
document.querySelectorAll('figure img').forEach((img) => img.addEventListener('click', () => img.parentElement.classList.toggle('zoom')))
</script>
</body>
</html>
`
}

// ---- Word --------------------------------------------------------------------------------------------
async function docx() {
  let lib
  try {
    lib = createRequire(resolve(process.cwd(), 'noop.js'))('docx')
  } catch {
    console.error('The `docx` package was not found. Install it into a scratch folder and run again from there:\n' +
      '  mkdir <scratch>/docgen && cd <scratch>/docgen && npm init -y && npm install docx@9\n' +
      '  cd <scratch>/docgen && node <skill>/scripts/build.mjs <outline.json> --docx <out.docx>')
    process.exit(3)
  }
  const { AlignmentType, BorderStyle, Document, HeadingLevel, ImageRun, LevelFormat, Packer, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType } = lib
  const font = chinese ? 'Microsoft JhengHei' : 'Calibri'
  const runs = (text, extra = {}) => String(text).split(/(\*\*.+?\*\*|`.+?`)/).filter(Boolean).map((part) =>
    part.startsWith('**') ? new TextRun({ text: part.slice(2, -2), bold: true, ...extra })
      : part.startsWith('`') ? new TextRun({ text: part.slice(1, -1), font: 'Consolas', ...extra })
        : new TextRun({ text: part, ...extra }))
  const para = (text, options = {}) => new Paragraph({ spacing: { after: 120 }, ...options, children: runs(text) })
  const bullets = (items) => (items ?? []).map((item) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 60 }, children: runs(item) }))
  const contentWidth = 9026 // A4 with 2.54 cm margins, in twentieths of a point
  const maxPixels = 600
  function image(step) {
    if (!step.image) return []
    const { bytes, type, width, height } = picture(step.image)
    const scale = Math.min(1, maxPixels / width)
    return [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, children: [new ImageRun({ type, data: bytes, transformation: { width: Math.round(width * scale), height: Math.round(height * scale) }, altText: { title: step.caption ?? '', description: step.caption ?? '', name: step.image } })] }),
      ...(step.caption ? [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: runs(step.caption, { size: 18, color: '666666' }) })] : [])
    ]
  }
  function grid(t) {
    if (!t) return []
    const width = Math.floor(contentWidth / t.headers.length)
    const widths = t.headers.map((_, i) => (i === t.headers.length - 1 ? contentWidth - width * (t.headers.length - 1) : width))
    const border = { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB' }
    const cell = (text, i, header) => new TableCell({
      borders: { top: border, bottom: border, left: border, right: border }, width: { size: widths[i], type: WidthType.DXA },
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      shading: header ? { fill: 'EEF2F6', type: ShadingType.CLEAR, color: 'auto' } : undefined,
      children: [new Paragraph({ children: runs(text, header ? { bold: true } : {}) })]
    })
    return [new Table({ width: { size: contentWidth, type: WidthType.DXA }, columnWidths: widths, rows: [
      new TableRow({ tableHeader: true, children: t.headers.map((h, i) => cell(h, i, true)) }),
      ...t.rows.map((row) => new TableRow({ children: row.map((c, i) => cell(c, i, false)) }))
    ] }), new Paragraph({ children: [] })]
  }
  const heading = (text, level) => new Paragraph({ heading: level, children: runs(text) })
  const children = [
    new Paragraph({ spacing: { after: 120 }, children: runs(outline.title, { bold: true, size: 36 }) }),
    ...(outline.subtitle ? [new Paragraph({ spacing: { after: 240 }, children: runs(outline.subtitle, { color: '666666' }) })] : []),
    ...(outline.summary?.length ? [heading(labels.summary, HeadingLevel.HEADING_1), ...bullets(outline.summary)] : [])
  ]
  for (const section of sections) {
    if (section.heading) children.push(heading(section.heading, HeadingLevel.HEADING_1))
    for (const text of section.paragraphs ?? []) children.push(para(text))
    children.push(...bullets(section.bullets))
    for (const step of section.steps ?? []) {
      children.push(heading(step.title ?? '', HeadingLevel.HEADING_2))
      if (step.source) children.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: labels.source, italics: true, color: '8A5A00' })] }))
      else if (step.observed) children.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: labels.observed, italics: true, color: '666666' })] }))
      for (const text of step.text ?? []) children.push(para(text))
      children.push(...bullets(step.bullets), ...image(step))
    }
    children.push(...grid(section.table))
  }
  const document = new Document({
    styles: {
      default: { document: { run: { font, size: 22 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 30, bold: true, font, color: '1F3864' }, paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 25, bold: true, font, color: '2E5395' }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } }
      ]
    },
    numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }] },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1200, bottom: 1200, left: 1440, right: 1440 } } }, children }]
  })
  return Packer.toBuffer(document)
}

if (flag('--html')) {
  writeFileSync(flag('--html'), html(), 'utf8')
  console.log(flag('--html'))
}
if (flag('--docx')) {
  writeFileSync(flag('--docx'), await docx())
  console.log(flag('--docx'))
}
