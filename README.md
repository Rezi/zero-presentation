# Zero Sync — internal tech talk

A six-slide deck on [Zero](https://zero.rocicorp.dev), the query-driven sync engine for
TypeScript + Postgres. Built for internal use at Applifting by **Tomas Rezac**.

## Running it

```sh
pnpm install
pnpm dev        # http://localhost:5173
```

Then press <kbd>F</kbd> for fullscreen and present.

## Controls

| Input                                                      | Action                       |
| ---------------------------------------------------------- | ---------------------------- |
| <kbd>→</kbd> <kbd>↓</kbd> <kbd>space</kbd> <kbd>PgDn</kbd> | next reveal / next slide     |
| <kbd>←</kbd> <kbd>↑</kbd> <kbd>PgUp</kbd> <kbd>⌫</kbd>     | previous reveal / slide      |
| Click                                                      | advance (left 20% goes back) |
| <kbd>Home</kbd> / <kbd>End</kbd>                           | first / last slide           |
| <kbd>F</kbd>                                               | toggle fullscreen            |
| Dots in the footer                                         | jump to a slide              |

Each slide reveals in steps, so the progress bar tracks reveals rather than slides.

The URL hash deep-links a position: `#3` is slide 3, `#3.4` is slide 3 at its fourth reveal —
handy for jumping straight to the architecture diagram mid-discussion.

## Slides

1. **Zero** — title, what it is in one sentence
2. **Why bother** — the latency tax of request/response, and why sync engines stayed niche
3. **How it works** — animated architecture diagram, stepped through the query and mutation lifecycle
4. **The API surface** — `defineQueries` / `useQuery` / `defineMutators`, plus the pitfalls
5. **Schema & ZQL** — hand-written schema vs. generating it from Drizzle/Prisma, and what ZQL can and can't express
6. **Reality check** — when to reach for Zero, when not to, and the hard numbers

## Structure

```
src/lib/Deck.svelte        navigation, progress, chrome, ambient background
src/lib/Code.svelte        dependency-free TS syntax highlighter
src/lib/types.ts           the Slide type
src/lib/slides/*.svelte    one component per slide, each takes a `step` prop
src/lib/styles/app.css     design tokens + shared slide primitives
src/routes/+page.svelte    the slide list (label, step count, component)
```

To add a slide, drop a component in `src/lib/slides/` that takes `{ step }`, then add it to the
`slides` array in `src/routes/+page.svelte` with its reveal count.

## Design

Palette and type follow [applifting.io](https://applifting.io): `#14141f` navy ground, `#fac61f`
yellow accent, cyan `#5ecae7` and green `#73c37c` for support, Inter for text and Roboto Mono for
code. The slow orbit rings are a nod to _"Lifting your ideas into digital orbit."_

Content is sourced from the [Zero overview](https://zero.rocicorp.dev/#how-it-works) and
[docs](https://zero.rocicorp.dev/docs/introduction).
