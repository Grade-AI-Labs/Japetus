import { describe, expect, it } from 'vitest';
import { storageToMarkdown } from '../../src/adapters/storage_to_markdown.ts';

describe('Confluence storage → markdown converter', () => {
  it('converts headings (h1..h6)', () => {
    const md = storageToMarkdown('<h1>A</h1><h2>B</h2><h3>C</h3>');
    expect(md).toContain('# A');
    expect(md).toContain('## B');
    expect(md).toContain('### C');
  });

  it('converts paragraphs', () => {
    expect(storageToMarkdown('<p>hello world</p>')).toContain('hello world');
  });

  it('converts unordered lists', () => {
    const md = storageToMarkdown('<ul><li>one</li><li>two</li></ul>');
    expect(md).toMatch(/^[-*]\s+one/m);
    expect(md).toMatch(/^[-*]\s+two/m);
  });

  it('converts ordered lists', () => {
    const md = storageToMarkdown('<ol><li>one</li><li>two</li></ol>');
    expect(md).toMatch(/1\.\s+one/);
    expect(md).toMatch(/2\.\s+two/);
  });

  it('preserves nested lists', () => {
    const md = storageToMarkdown('<ul><li>parent<ul><li>child</li></ul></li></ul>');
    expect(md).toContain('parent');
    expect(md).toContain('child');
    // child should be indented deeper than parent
    const parentIdx = md.indexOf('parent');
    const childIdx = md.indexOf('child');
    expect(childIdx).toBeGreaterThan(parentIdx);
  });

  it('converts simple tables', () => {
    const md = storageToMarkdown(
      '<table><tr><th>Header A</th><th>Header B</th></tr><tr><td>1</td><td>2</td></tr></table>',
    );
    expect(md).toContain('Header A');
    expect(md).toContain('Header B');
    expect(md).toMatch(/\|/); // markdown table separator
  });

  it('converts inline code', () => {
    expect(storageToMarkdown('<p>use <code>foo()</code></p>')).toContain('`foo()`');
  });

  it('converts code blocks with language hints (Confluence code macro)', () => {
    const storage = `
      <ac:structured-macro ac:name="code" ac:schema-version="1">
        <ac:parameter ac:name="language">python</ac:parameter>
        <ac:plain-text-body><![CDATA[def hi():
    print("ok")]]></ac:plain-text-body>
      </ac:structured-macro>
    `;
    const md = storageToMarkdown(storage);
    expect(md).toContain('```python');
    expect(md).toContain('def hi():');
    expect(md).toContain('print("ok")');
    expect(md).toContain('```');
  });

  it('converts Confluence info/note/warning panels to blockquotes', () => {
    const storage = `
      <ac:structured-macro ac:name="info">
        <ac:rich-text-body><p>Heads up — this is an info panel.</p></ac:rich-text-body>
      </ac:structured-macro>
    `;
    const md = storageToMarkdown(storage);
    expect(md).toMatch(/^>\s+/m);
    expect(md).toContain('Heads up');
  });

  it('renders inline emphasis (bold + italic)', () => {
    const md = storageToMarkdown('<p><strong>bold</strong> and <em>italic</em></p>');
    expect(md).toMatch(/\*\*bold\*\*/);
    expect(md).toMatch(/[*_]italic[*_]/);
  });

  it('renders standard <img> with alt text as markdown image', () => {
    const md = storageToMarkdown('<p><img src="https://x/y.png" alt="diagram"/></p>');
    expect(md).toContain('![diagram](https://x/y.png)');
  });

  it('renders Confluence ac:image attachment as markdown image with filename as alt', () => {
    const storage = `<ac:image><ri:attachment ri:filename="diagram.png"/></ac:image>`;
    const md = storageToMarkdown(storage);
    expect(md).toMatch(/!\[diagram\.png\]\(diagram\.png\)/);
  });

  it('renders links', () => {
    expect(storageToMarkdown('<p>see <a href="https://x/y">the docs</a></p>')).toContain(
      '[the docs](https://x/y)',
    );
  });

  it('degrades gracefully for unsupported macros — emits best-effort plain text, not raw HTML', () => {
    const storage = `
      <ac:structured-macro ac:name="weird-thing">
        <ac:rich-text-body><p>fallback content</p></ac:rich-text-body>
      </ac:structured-macro>
    `;
    const md = storageToMarkdown(storage);
    expect(md).toContain('fallback content');
    expect(md).not.toContain('<ac:');
  });

  it('preserves the smoke-test conversion: heading + paragraph + list', () => {
    const storage = '<h1>Title</h1><p>Intro</p><ul><li>a</li><li>b</li></ul>';
    const md = storageToMarkdown(storage);
    expect(md).toMatch(/# Title/);
    expect(md).toMatch(/Intro/);
    expect(md).toMatch(/[-*]\s+a/);
    expect(md).toMatch(/[-*]\s+b/);
  });
});
