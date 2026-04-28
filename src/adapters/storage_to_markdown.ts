import TurndownService from 'turndown';
// @ts-expect-error — turndown-plugin-gfm ships only a CommonJS build with no types.
import { gfm } from 'turndown-plugin-gfm';

/**
 * Convert Confluence storage-format XHTML to markdown.
 *
 * Strategy: pre-process Confluence-specific elements (`ac:structured-macro`,
 * `ac:image`, `ri:attachment`, …) into vanilla HTML that turndown understands
 * (`<pre>`, `<blockquote>`, `<img>`), then run turndown with the GFM tables
 * plugin and a small set of custom rules. Unknown macros degrade gracefully:
 * inner content survives, the wrapper is dropped, and no raw `<ac:` tags leak
 * into the markdown output.
 */
export function storageToMarkdown(storage: string): string {
  if (!storage) return '';
  const html = preprocessConfluenceMacros(storage);
  const td = createTurndown();
  return td.turndown(html).trim();
}

function createTurndown(): TurndownService {
  const td = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    fence: '```',
    emDelimiter: '_',
    strongDelimiter: '**',
    linkStyle: 'inlined',
  });
  // Tables, strikethrough, task list items.
  td.use(gfm);

  // Honour `class="language-foo"` on <pre><code> by emitting fenced blocks
  // with the language hint.
  type DomLike = {
    nodeName: string;
    firstChild: DomLike | null;
    textContent: string | null;
    getAttribute(name: string): string | null;
  };
  td.addRule('confluence-fenced-code', {
    filter(node) {
      const n = node as unknown as DomLike;
      return n.nodeName === 'PRE' && n.firstChild != null && n.firstChild.nodeName === 'CODE';
    },
    replacement(_content, node) {
      const codeEl = (node as unknown as DomLike).firstChild as DomLike;
      const cls = codeEl.getAttribute('class') ?? '';
      const langMatch = cls.match(/language-([\w+-]+)/);
      const lang = langMatch?.[1] ?? '';
      const text = codeEl.textContent ?? '';
      return `\n\n\`\`\`${lang}\n${text.replace(/\n+$/, '')}\n\`\`\`\n\n`;
    },
  });

  return td;
}

/**
 * Transform Confluence-specific structured macros into vanilla HTML so the
 * downstream turndown pass produces sensible markdown. Conservative: anything
 * we don't recognize loses its outer wrapper but keeps its inner text content.
 */
function preprocessConfluenceMacros(storage: string): string {
  let html = storage;

  // Code macros: <ac:structured-macro ac:name="code">
  //   <ac:parameter ac:name="language">X</ac:parameter>
  //   <ac:plain-text-body><![CDATA[ ... ]]></ac:plain-text-body>
  // </ac:structured-macro>
  html = html.replace(
    /<ac:structured-macro[^>]*ac:name="code"[^>]*>([\s\S]*?)<\/ac:structured-macro>/gi,
    (_m, inner: string) => {
      const langMatch = inner.match(
        /<ac:parameter[^>]*ac:name="language"[^>]*>([^<]*)<\/ac:parameter>/i,
      );
      const lang = (langMatch?.[1] ?? '').trim();
      const bodyMatch = inner.match(
        /<ac:plain-text-body><!\[CDATA\[([\s\S]*?)\]\]><\/ac:plain-text-body>/i,
      );
      const body = bodyMatch?.[1] ?? stripTags(inner);
      const langAttr = lang ? ` class="language-${escapeAttr(lang)}"` : '';
      return `<pre><code${langAttr}>${escapeHtml(body)}</code></pre>`;
    },
  );

  // Panels (info / note / warning / tip / panel) → blockquote.
  html = html.replace(
    /<ac:structured-macro[^>]*ac:name="(info|note|warning|tip|panel)"[^>]*>([\s\S]*?)<\/ac:structured-macro>/gi,
    (_m, _name: string, inner: string) => {
      const bodyMatch = inner.match(/<ac:rich-text-body[^>]*>([\s\S]*?)<\/ac:rich-text-body>/i);
      const body = bodyMatch?.[1] ?? inner;
      return `<blockquote>${body}</blockquote>`;
    },
  );

  // Confluence images: <ac:image ...><ri:attachment ri:filename="X"/></ac:image>
  html = html.replace(
    /<ac:image[^>]*>\s*<ri:attachment[^>]*ri:filename="([^"]+)"[^>]*\/?>\s*<\/ac:image>/gi,
    (_m, filename: string) => `<img src="${filename}" alt="${filename}"/>`,
  );
  html = html.replace(
    /<ac:image[^>]*>\s*<ri:url[^>]*ri:value="([^"]+)"[^>]*\/?>\s*<\/ac:image>/gi,
    (_m, url: string) => `<img src="${url}" alt=""/>`,
  );

  // Anything else under ac:* / ri:* — drop the wrapper but keep content.
  // Self-closing ri:* tags lose all content.
  html = html.replace(/<ri:[^>]*\/?>(?:[\s\S]*?<\/ri:[^>]*>)?/gi, '');

  // Generic fallback: drop ac:structured-macro wrappers, keep ac:rich-text-body content.
  html = html.replace(
    /<ac:structured-macro[^>]*>([\s\S]*?)<\/ac:structured-macro>/gi,
    (_m, inner: string) => {
      const richMatch = inner.match(/<ac:rich-text-body[^>]*>([\s\S]*?)<\/ac:rich-text-body>/i);
      return richMatch?.[1] ?? stripTags(inner);
    },
  );

  // Strip remaining ac:rich-text-body wrappers (keep content).
  html = html.replace(
    /<ac:rich-text-body[^>]*>([\s\S]*?)<\/ac:rich-text-body>/gi,
    (_m, inner: string) => inner,
  );

  // Strip Confluence-only inline tags but preserve their textual content.
  html = html.replace(/<\/?ac:[^>]+>/gi, '');

  return html;
}

function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(s: string): string {
  return s.replace(/[&"'<>]/g, (ch) => `&#${ch.charCodeAt(0)};`);
}
