---
title: WCAG 2.1 AA Baseline
description: Accessibility baseline for user-facing products at Talentech AI Labs.
owner: frontend-eng
---

> **Placeholder content.** Seeded for the `talentech-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

All customer-facing surfaces meet WCAG 2.1 AA. This document is the minimum;
specific products may go further.

## Color and contrast

- Text contrast ratio: at least 4.5:1 for body text, 3:1 for large text
  (18pt+ or 14pt bold+).
- Do not use color as the sole conveyor of information. Pair with icon, text,
  or pattern.
- Focus indicators contrast at least 3:1 against their background.

## Keyboard navigation

- Every interactive element is reachable via Tab.
- Tab order follows visual order. Do not use `tabindex` > 0.
- Escape closes modals, popovers, and menus.
- Enter and Space activate buttons. Arrow keys navigate within composite
  widgets (menus, listboxes, tabs).
- No keyboard traps. You can always Tab out of any widget.

## Focus

- Every focusable element has a visible focus indicator. Do not remove the
  browser default without providing a replacement.
- On route change, move focus to the new main content (`<h1>` or the main
  region).
- On modal open, move focus inside. On close, restore focus to the trigger.

## Semantics

- Use native elements: `<button>`, `<a href>`, `<input>`, `<label>`.
  Do not rebuild them with `<div>` + click handlers.
- One `<h1>` per page. Heading levels do not skip.
- Landmarks: `<main>`, `<nav>`, `<header>`, `<footer>` used once per page.

## Images and media

- Every informative image has an `alt` attribute describing its purpose.
- Decorative images have `alt=""`.
- Video has captions. Audio has transcripts.
- Auto-play is off by default.

## Forms

- Every input has a programmatically-associated `<label>`. Placeholder is
  not a label.
- Errors are announced to assistive tech (e.g., `aria-live="polite"` on the
  error region) and visually associated with the field.
- Required fields are marked in text as well as with `aria-required`.

## ARIA

- Prefer native HTML over ARIA. Reach for ARIA only when HTML lacks the
  semantics.
- `aria-label` on icon-only buttons. Never on elements with visible text
  (the visible text is the accessible name).
- Do not add `role="button"` to a `<button>`. It is redundant.

## Per-component checklist

For any new interactive component, verify:

- [ ] Reachable by keyboard.
- [ ] Visible focus indicator.
- [ ] Accessible name (label or aria-label).
- [ ] State is announced (checked, expanded, selected).
- [ ] Works at 200% browser zoom.
- [ ] Works in high-contrast / forced-colors mode.
- [ ] Screen reader test in NVDA or VoiceOver.

## Testing

- Run `axe-core` in unit tests for components.
- Manual keyboard-only pass before merging UI work.
- Automated Lighthouse a11y score >= 95 in CI for critical pages.
