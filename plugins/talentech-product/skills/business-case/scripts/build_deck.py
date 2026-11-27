#!/usr/bin/env python3
"""Build the 8-slide management deck on the Talentech template from a JSON spec.

Usage:
    python build_deck.py spec.json out.pptx [--template assets/talentech-template.potx]

The spec holds only content; every slide's look comes from the template's layouts
(see references/deck-outline.md for the mapping). A complete spec is in
examples/background-checks-deck-spec.json. Keys:

{
  "title":    {"title": "...", "subtitle": "...", "byline": "..."},
  "propose":  {"title": "...", "blocks": [{"head": "...", "body": "..."}, x3]},
  "evidence": {"title": "...", "subtitle": "...", "stats": [{"number": "67%", "label": "..."}, x3]},
  "scope":    {"title": "...", "mvp": [...], "later": [...], "never": [...]},
  "value":    {"title": "...", "subtitle": "...", "categories": ["12 months after launch", "36 months after launch"],
               "low": [0.18, 1.5], "base": [0.37, 3.8], "high": [0.61, 6.1], "unit": "M",
               "formula_head": "The formula", "formula": ["...", "..."], "footnote": "..."},
  "cost":     {"title": "...", "rows": [["Role", "Share", "Weeks", "pw", "€"], ...], "kpis": [{"number": "...", "label": "..."}, x3],
               "left_head": "Team", "left": "...", "right_head": "Estimate", "right": "..."},
  "risks":    {"title": "...", "rows": [["Type", "Risk", "Kill criterion"], ...], "gate_note": "...",
               "milestones": [{"label": "M0", "text": "Build starts", "at": 0.0, "gate": false}, ...]},
  "decision": {"kicker": "The decision", "ask": "...", "lines": ["...", "..."]},
  "notes":    {"title": "...", "propose": "...", ...}      # optional speaker notes per slide key
}

Needs python-pptx. Fonts and colours are read from the template; only text, the
chart series and the tables come from the spec.
"""
import json, os, sys, zipfile
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION, XL_LABEL_POSITION
from pptx.oxml.ns import qn

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_TEMPLATE = os.path.join(HERE, "..", "assets", "talentech-template.potx")

# Template layouts used (1-based index in the template's layout list)
L_TITLE, L_DARK_PARAS, L_BOXES3, L_BULLETS_LIGHT, L_CHART_INSIGHTS, L_LIGHT_PARAS, L_QUOTE = 3, 25, 36, 20, 42, 23, 19

BODY_FONT, HEAD_FONT = "Season Sans-TRIAL", "Season Sans-TRIAL Medium"
DK1, LT1 = RGBColor(0x09, 0x03, 0x12), RGBColor(0xFB, 0xFB, 0xFB)
ACC1, ACC2, ACC4 = RGBColor(0xB3, 0xB3, 0xFF), RGBColor(0x7B, 0x7B, 0xFF), RGBColor(0xEE, 0x45, 0x2B)
GREY, TINT, DARK_CELL = RGBColor(0x8A, 0x88, 0x94), RGBColor(0xF3, 0xF3, 0xF7), RGBColor(0x17, 0x11, 0x24)


def potx_to_pptx(src, dst):
    """A .potx is a .pptx with a template content type; python-pptx needs the presentation type."""
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == "[Content_Types].xml":
                data = data.replace(b"presentationml.template.main+xml", b"presentationml.presentation.main+xml")
            zout.writestr(item, data)


def ph(slide, idx):
    for p in slide.placeholders:
        if p.placeholder_format.idx == idx:
            return p
    raise KeyError(f"placeholder {idx} not on slide")


def remove_ph(slide, idx):
    el = ph(slide, idx)._element
    el.getparent().remove(el)


def move_ph(slide, idx, top, height):
    p = ph(slide, idx)
    left, width = p.left, p.width          # inherited from the layout
    p.left, p.width, p.top, p.height = left, width, Inches(top), Inches(height)  # write all four or the shape collapses


def set_paras(tf, paras, size=None, color=None, font=None):
    tf.clear()
    for n, item in enumerate(paras):
        text, o = (item, {}) if isinstance(item, str) else item
        p = tf.paragraphs[0] if n == 0 else tf.add_paragraph()
        if "align" in o: p.alignment = o["align"]
        if "space_after" in o: p.space_after = Pt(o["space_after"])
        r = p.add_run(); r.text = text
        sz = o.get("size", size)
        if sz: r.font.size = Pt(sz)
        if o.get("bold"): r.font.bold = True
        col = o.get("color", color)
        if col is not None: r.font.color.rgb = col
        fn = o.get("font", font)
        if fn: r.font.name = fn
        if o.get("no_bullet"):
            pPr = p._p.get_or_add_pPr(); pPr.set("marL", "0"); pPr.set("indent", "0")
            pPr.append(pPr.makeelement(qn("a:buNone"), {}))


def fill(slide, idx, paras, **kw):
    set_paras(ph(slide, idx).text_frame, paras, **kw)


def textbox(slide, x, y, w, h, paras, size=12, color=DK1, font=BODY_FONT):
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame; tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    set_paras(tf, paras, size=size, color=color, font=font)
    return tb


def card(slide, x, y, w, h, rgb=LT1):
    s = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    s.adjustments[0] = 0.04
    s.fill.solid(); s.fill.fore_color.rgb = rgb
    s.line.fill.background(); s.shadow.inherit = False
    return s


def table(slide, rows, x, y, w, h, col_w, size=11, head_fill=DK1, head_color=LT1, body_fill=LT1, body_color=DK1,
          last_bold=False, right_from=1):
    shp = slide.shapes.add_table(len(rows), len(rows[0]), Inches(x), Inches(y), Inches(w), Inches(h))
    t = shp.table; t.first_row = True; t.horz_banding = False; t.vert_banding = False
    for j, cw in enumerate(col_w): t.columns[j].width = Inches(cw)
    for i, row in enumerate(rows):
        for j, val in enumerate(row):
            c = t.cell(i, j); c.fill.solid(); c.fill.fore_color.rgb = head_fill if i == 0 else body_fill
            c.margin_left = c.margin_right = Inches(0.08); c.margin_top = c.margin_bottom = Inches(0.04)
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            tf = c.text_frame; tf.word_wrap = True
            p = tf.paragraphs[0]; p.text = ""
            r = p.add_run(); r.text = str(val)
            r.font.size = Pt(size); r.font.name = BODY_FONT
            r.font.bold = (i == 0) or (last_bold and i == len(rows) - 1)
            r.font.color.rgb = head_color if i == 0 else body_color
            if j >= right_from: p.alignment = PP_ALIGN.RIGHT
    return shp


def notes(slide, text):
    if text: slide.notes_slide.notes_text_frame.text = text


def build(spec, template, out):
    base = out + ".base.pptx"
    potx_to_pptx(template, base)
    prs = Presentation(base)
    lst = prs.slides._sldIdLst
    for sid in list(lst):                       # drop the template's own slides
        prs.part.drop_rel(sid.rId); lst.remove(sid)
    lay = lambda n: prs.slide_layouts[n - 1]
    N = spec.get("notes", {})

    # 1 Title
    d = spec["title"]; s = prs.slides.add_slide(lay(L_TITLE))
    fill(s, 0, [d["title"]])
    fill(s, 1, [d["subtitle"], (d.get("byline", ""), {"size": 14})])
    notes(s, N.get("title"))

    # 2 What we propose and why now: three cards
    d = spec["propose"]; s = prs.slides.add_slide(lay(L_DARK_PARAS))
    fill(s, 0, [d["title"]]); remove_ph(s, 16); remove_ph(s, 17)
    for i, b in enumerate(d["blocks"][:3]):
        x = 0.31 + i * 4.3
        card(s, x, 2.6, 3.95, 3.5)
        textbox(s, x + 0.3, 2.85, 3.35, 0.5, [(b["head"], {"bold": True})], size=20, font=HEAD_FONT)
        textbox(s, x + 0.3, 3.45, 3.35, 2.5, [b["body"]], size=13)
    notes(s, N.get("propose"))

    # 3 Evidence: three stat boxes
    d = spec["evidence"]; s = prs.slides.add_slide(lay(L_BOXES3))
    fill(s, 0, [d["title"]]); fill(s, 14, [d.get("subtitle", "")])
    for (ih, ib), st in zip([(18, 15), (19, 16), (20, 17)], d["stats"][:3]):
        fill(s, ih, [(st["number"], {"size": 40, "bold": True})])
        fill(s, ib, [(st["label"], {"size": 12})])
    notes(s, N.get("evidence"))

    # 4 Scope: two bullet columns
    d = spec["scope"]; s = prs.slides.add_slide(lay(L_BULLETS_LIGHT))
    fill(s, 0, [d["title"]])
    move_ph(s, 14, 2.5, 3.9); move_ph(s, 15, 2.5, 3.9)
    fill(s, 14, [("MVP", {"bold": True, "size": 17, "no_bullet": True})] + list(d["mvp"]))
    fill(s, 15, [("Maybe later", {"bold": True, "size": 17, "no_bullet": True})] + list(d["later"]) +
                [("Probably never", {"bold": True, "size": 17, "no_bullet": True})] + list(d["never"]))
    notes(s, N.get("scope"))

    # 5 Value: chart with insights
    d = spec["value"]; s = prs.slides.add_slide(lay(L_CHART_INSIGHTS))
    fill(s, 0, [d["title"]]); fill(s, 14, [d.get("subtitle", "")])
    cd = CategoryChartData(); cd.categories = d["categories"]
    for name in ("low", "base", "high"):
        cd.add_series(name.capitalize(), d[name])
    ch = ph(s, 15).insert_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, cd).chart
    ch.font.size = Pt(11); ch.font.name = BODY_FONT; ch.font.color.rgb = DK1
    ch.has_legend = True; ch.legend.position = XL_LEGEND_POSITION.BOTTOM; ch.legend.include_in_layout = False
    plot = ch.plots[0]; plot.gap_width = 80; plot.overlap = -10; plot.has_data_labels = True
    unit = d.get("unit", "M")
    dl = plot.data_labels; dl.number_format = f'"€"0.0#"{unit}"'; dl.number_format_is_linked = False
    dl.position = XL_LABEL_POSITION.OUTSIDE_END; dl.font.size = Pt(10)
    for ser, col in zip(plot.series, (ACC1, ACC2, DK1)):
        ser.format.fill.solid(); ser.format.fill.fore_color.rgb = col
    va = ch.value_axis; va.minimum_scale = 0
    if "axis_max" in d: va.maximum_scale = d["axis_max"]
    va.has_major_gridlines = True; va.major_gridlines.format.line.color.rgb = RGBColor(0xE4, 0xE4, 0xEC)
    va.tick_labels.number_format = f'"€"0"{unit}"'; va.tick_labels.number_format_is_linked = False
    va.tick_labels.font.size = Pt(10); va.tick_labels.font.color.rgb = GREY; va.format.line.fill.background()
    ch.category_axis.tick_labels.font.size = Pt(11); ch.category_axis.format.line.color.rgb = RGBColor(0xC8, 0xC8, 0xD2)
    fill(s, 23, [d.get("formula_head", "The formula")])
    fl = list(d["formula"]); fill(s, 17, fl[:-1] + [(fl[-1], {"bold": True})] if fl else [""])
    fill(s, 16, [d.get("footnote", "")])
    notes(s, N.get("value"))

    # 6 Cost: table and three stats
    d = spec["cost"]; s = prs.slides.add_slide(lay(L_LIGHT_PARAS))
    fill(s, 0, [d["title"]])
    ncol = len(d["rows"][0]); col_w = d.get("col_w") or [7.2 - 1.05 * (ncol - 1)] + [1.05] * (ncol - 1)
    table(s, d["rows"], 0.31, 2.2, 7.2, 2.8, col_w, size=11, last_bold=True, body_fill=TINT)
    for i, k in enumerate(d["kpis"][:3]):
        y = 2.2 + i * 0.97
        card(s, 8.0, y, 5.0, 0.88, rgb=TINT)
        textbox(s, 8.2, y + 0.08, 4.6, 0.4, [(k["number"], {"bold": True})], size=18, font=HEAD_FONT, color=ACC2)
        textbox(s, 8.2, y + 0.46, 4.6, 0.42, [k["label"]], size=9.5)
    fill(s, 16, [(d.get("left_head", "Team"), {"bold": True}), d.get("left", "")], size=11)
    fill(s, 17, [(d.get("right_head", "Estimate"), {"bold": True}), d.get("right", "")], size=11)
    notes(s, N.get("cost"))

    # 7 Risks and gates
    d = spec["risks"]; s = prs.slides.add_slide(lay(L_DARK_PARAS))
    fill(s, 0, [d["title"]]); remove_ph(s, 16); remove_ph(s, 17)
    rows = d["rows"][:6]
    table(s, rows, 0.31, 1.95, 12.7, 0.48 * len(rows), [1.5, 5.8, 5.4], size=11, head_fill=ACC1, head_color=DK1,
          body_fill=DARK_CELL, body_color=LT1, right_from=99)
    textbox(s, 0.31, 4.62, 12.7, 0.3, [d.get("gate_note", "")], size=11, color=ACC1)
    ty, tx0, tx1 = 5.75, 0.9, 12.4
    ln = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(tx0), Inches(ty), Inches(tx1), Inches(ty))
    ln.line.color.rgb = ACC1; ln.line.width = Pt(1.5)
    for m in d["milestones"]:
        x = tx0 + float(m["at"]) * (tx1 - tx0); gate = bool(m.get("gate"))
        r = 0.14 if gate else 0.11
        shp = s.shapes.add_shape(MSO_SHAPE.DIAMOND if gate else MSO_SHAPE.OVAL, Inches(x - r), Inches(ty - r), Inches(2 * r), Inches(2 * r))
        shp.fill.solid(); shp.fill.fore_color.rgb = ACC4 if gate else ACC1
        shp.line.fill.background(); shp.shadow.inherit = False
        textbox(s, x - 0.8, ty - 0.55, 1.6, 0.3, [(m["label"], {"bold": True, "align": PP_ALIGN.CENTER})], size=12, color=LT1, font=HEAD_FONT)
        textbox(s, x - 1.1, ty + 0.22, 2.2, 0.5, [(m["text"], {"align": PP_ALIGN.CENTER})], size=10.5, color=LT1)
    notes(s, N.get("risks"))

    # 8 Decision
    d = spec["decision"]; s = prs.slides.add_slide(lay(L_QUOTE))
    fill(s, 1, [d.get("kicker", "The decision")])
    fill(s, 0, [d["ask"]], size=36)
    lines = [(t, {"space_after": 6}) for t in d.get("lines", [])]
    if lines: textbox(s, 0.32, 5.3, 11.6, 1.2, lines, size=13, color=ACC1)
    notes(s, N.get("decision"))

    prs.save(out)
    os.remove(base)
    return out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) < 2:
        print(__doc__); sys.exit(1)
    template = DEFAULT_TEMPLATE
    if "--template" in sys.argv:
        template = sys.argv[sys.argv.index("--template") + 1]
    with open(args[0]) as f:
        spec = json.load(f)
    print("saved", build(spec, template, args[1]))


if __name__ == "__main__":
    main()
