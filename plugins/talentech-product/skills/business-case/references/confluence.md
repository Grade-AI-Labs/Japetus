# Confluence: where cases live and how to post them

Cases live in Talentech's Confluence, space **Talentech Internal (HRMTS)**, under *Product Team Workspace*. Two pages exist and must not be recreated:

| Page | ID | URL | Purpose |
| --- | --- | --- | --- |
| Business cases | 2758246493 | https://talentechgroup.atlassian.net/wiki/spaces/HRMTS/pages/2758246493/Business+cases | Parent of every case page. Holds the comparison table, the tier and category tables, and the process. |
| Business case template | 2758180952 | https://talentechgroup.atlassian.net/wiki/spaces/HRMTS/pages/2758180952/Business+case+template | The page a PM copies to write a case by hand. The skill produces the same structure. |

Site: `talentechgroup.atlassian.net` (use it as `cloudId`). Space ID: 2088009728.

## With the Atlassian connector

Do this after the case is written and the PM has confirmed the card. Three steps.

**1. Create the case page** as a child of the parent: `createConfluencePage` with `cloudId` the site, `spaceId` `HRMTS`, `parentId` `2758246493`, `title` the case title, `contentFormat` `html`. Call `getContentFormatGuide` for `createConfluencePage` once per session before authoring the body. Convert the case as follows:

- The card becomes a two-column table (`Field`, `Value`) with the 14 rows in template order; `<strong>` on the field names is not needed, the header row is enough.
- "Open questions" and "Notes" are two paragraphs with the label in `<strong>`.
- Each section heading is `<h2>` with its number ("## 4. Value logic" becomes `<h2>4. Value logic</h2>`); section tables become `<table>` with a `<thead>` row; prose becomes `<p>`; lists become `<ul>`.
- No panels around the card and no placeholders: the page is a finished case, not a template.
- Small cases: the card, open questions and notes only. Medium: card plus sections 2, 3, 5 and the risk table of 8. Large: everything.

**2. Add the row to the comparison table** on the parent page. Fetch the parent with `getConfluencePage` (`pageId` `2758246493`, `contentFormat` `html`). The comparison table is the first table on the page: 14 columns in this order: Title, Owner, Product(s), Tier, Category, Value 12m (base €), Confidence, Effort (pw), Build cost (€), Value/effort, Top risk, Why now, Review date, Status. Build the new `<tr>`:

- Title: a plain link to the new page, `<a href="<page URL>">Case title</a>` (a plain link, not a smart-link card, so the title stays readable in the cell).
- Value 12m: the base figure for a large case, the band midpoint (XS 12k, S 60k, M 300k, L 1.2M, XL 2.5M) for small and medium, written as a number with thousands separators.
- Confidence as a percentage; Effort as person-weeks with one decimal; Build cost in €; Value/effort with two decimals.
- Top risk and Why now: one short line each.
- Review date: `<time datetime="YYYY-MM-DD">` when a date exists, otherwise "n/a".
- Status: `Submitted` as a status lozenge, `<span data-type="status" data-color="blue">Submitted</span>`.

If the table's only body row starts with "No cases yet", replace that row; otherwise append the new row at the end of `<tbody>`. Then `updateConfluencePage` with the whole page body, every other element exactly as fetched (keep `data-layout`, any `data-colwidth`, the panels and the links), and `versionMessage` "Add case: <title>". Never rewrite the rest of the parent page from memory; a lost row or a dropped paragraph there is somebody else's case.

**3. Tell the PM** the new page URL and that the row is on the parent page with status Submitted. The steering group changes the status.

If the connector refuses or is unavailable at step 2 (for example a version conflict because someone edited the parent at the same moment), fetch the parent again and retry once; if it fails again, hand the PM the row as markdown and say that the row still has to be added.

## Without the connector

Hand the PM the case page content as markdown (the card table first, then the sections) and the comparison row as a single markdown table row, and point them to the two pages above: copy the template page under *Business cases*, paste the content with Insert → Markdown, and add the row to the comparison table by hand with status Submitted.

## Deck attachment

For a large case, the 8-slide deck is a file (`.pptx`) handed to the PM; attaching it to the case page is done by the PM in Confluence (the connector does not upload attachments). Mention it in the reply: "attach the deck to the case page before the steering group review".
