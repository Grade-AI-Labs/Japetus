---
title: React Component Patterns
description: Conventions for building React components at Grade AI Labs.
owner: frontend-eng
---

> **Placeholder content.** Seeded for the `grade-standards` MCP server. HITL
> review from content owners is pending as part of slice 09. See
> `plans/issues/09-seed-corpus.md`.

Target: React 18+, Next.js 14+ App Router. Apply to all new UI work.

## Composition

- Compose with children and slot props. Do not build class hierarchies.
- A component that takes more than 6 props is probably two components.
- Prefer "dumb" presentational components that receive data and callbacks.
  Keep data fetching and orchestration at the route or container level.

## Hooks vs context

- Custom hooks encapsulate behaviour (state + effects). Name them `useX`.
- Context is for values that many components at different depths need and
  that change rarely (theme, current user, feature flags).
- Do not use context as a global store. Reach for a store library (Zustand,
  Redux Toolkit) when you have cross-cutting mutable state.
- Every context has a Provider and a `useX()` hook that throws if used
  outside the Provider. No silent defaults.

## When to split a component

Split when any of these are true:

- The file exceeds ~200 lines.
- A subtree is conditionally rendered and has its own state.
- The same JSX appears twice with small variations.
- A part of the component is reused elsewhere.

Do not split purely for line count — splitting too early creates prop-drilling
noise.

## Server vs client components (App Router)

- Default to Server Components. Add `"use client"` only when you need:
  - Browser APIs (`window`, `document`, `localStorage`).
  - Event handlers or interactive state.
  - Hooks like `useState`, `useEffect`, `useReducer`.
- Data fetching belongs in Server Components. Do not fetch in `useEffect`
  for data that could be resolved on the server.
- Pass serializable data only across the server/client boundary.
- Keep the client bundle small: isolate interactive leaves and import them
  into server parents, not the other way around.

## Styling

- Tailwind for layout and atomic styling. No inline `style` for static values.
- Use CSS variables for theme tokens. Do not hardcode colors.
- Co-locate component-specific styles (CSS modules) when Tailwind gets noisy
  (>8 classes with conditional logic). Use `clsx` or `cva` for variants.
- No global CSS outside the design-system package.

## Accessibility

- Every interactive element is reachable by keyboard.
- Labels are associated with inputs. No placeholder-as-label.
- See `content/conventions/accessibility/wcag-baseline.md`.

## Testing

- Test behaviour through the DOM with React Testing Library. Query by role,
  not by test-id, unless semantics truly don't apply.
- Do not test implementation details (internal state, private hooks).

## Anti-patterns

- `useEffect` that depends on a derived value — derive in render.
- Prop-drilling 4+ levels. Introduce context or restructure.
- Components that return different component types based on a prop. Split them.
