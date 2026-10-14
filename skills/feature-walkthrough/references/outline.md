# The outline file

`scripts/build.mjs` turns one JSON outline and its pictures into the page. Image paths are relative
to the outline file. In any text, `**bold**` and `` `code` `` are kept; everything else is plain
text (no HTML).

```json
{
  "title": "舊版 TSMS「檢測報表匯出」操作說明",
  "subtitle": "TSMS-RPT-01（PrintInspectData），供議題 #22 討論",
  "lang": "zh-Hant",
  "summary": [
    "舊版的檢測報表分四個區塊，共 10 個勾選項目。",
    "**沒有排水設施檢查**：畫面、範本與程式都沒有。"
  ],
  "sections": [
    {
      "heading": "操作步驟",
      "paragraphs": ["以下畫面取自舊版程式，在測試資料上操作。"],
      "steps": [
        {
          "title": "步驟 1：開啟報表畫面",
          "text": ["從主選單的「安檢資料輸出」選「檢測報表匯出」。"],
          "image": "shots/1-main.png",
          "caption": "圖 1　主畫面"
        },
        {
          "title": "步驟 4：產生 Excel",
          "source": true,
          "bullets": ["把範本複製到輸出資料夾。", "原始碼中沒有存檔的指令。"]
        }
      ]
    },
    {
      "heading": "勾選項目與工作表",
      "table": { "headers": ["區塊", "勾選項目", "工作表"], "rows": [["隧道", "損傷安檢資料", "隧道損傷紀錄"]] }
    },
    { "heading": "與 #22 的關係", "bullets": ["選項一：…", "選項二：…"] }
  ],
  "labels": { "source": "依原始碼，未實際執行", "summary": "結論" }
}
```

| Field | |
|---|---|
| `title` | The page title and the browser tab's name. A name, not a sentence. |
| `subtitle` | One line under the title: program, feature, question. Optional. |
| `lang` | The page language (`zh-Hant`, `en`). Sets fonts and the default labels. |
| `summary` | The conclusion bullets, shown first under the `labels.summary` heading. |
| `sections[]` | In order. Each may have `heading`, `paragraphs`, `bullets`, `steps`, `table`, in that order on the page. |
| `steps[]` | `title`, then `text` (paragraphs) and/or `bullets`, then `image` and `caption`. `source: true` marks a step described from the code rather than run; it gets the `labels.source` tag. |
| `table` | `headers` and `rows`, all text. |
| `labels` | Overrides for the fixed words: `summary`, `source`, `observed` (unused unless you set `observed: true` on a step). Defaults follow `lang`. |
