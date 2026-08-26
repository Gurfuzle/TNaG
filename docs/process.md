# Process

This document describes how we plan and ship changes to TNaG. The goal is to
think before we build: capture an idea as a written plan, break it into small
tasks, then implement them one at a time.

## The three stages

### 1. Plan the change

Every non-trivial change starts as a Markdown file in [`docs/planning/`](./planning/).

- Copy [`docs/planning/TEMPLATE.md`](./planning/TEMPLATE.md) to a new file named
  after the idea, e.g. `docs/planning/add-event-rsvp.md`.
- Fill it in: what problem are we solving, why, what the change looks like, and
  how it fits the [architecture](./architecture.md) and [mission](./mission.md).
- Keep it focused. A plan should describe **one** coherent change.
- A plan is a thinking tool, not a contract. Revise it as understanding
  improves. It's fine to abandon a plan that no longer makes sense.

Trivial changes (a typo, a new blog post, a new league row) don't need a plan —
follow the recipes in the [README](../README.md) and ship them.

### 2. Break it into small tasks

Once the plan is agreed on, break it into a checklist of **small, independently
verifiable tasks** at the bottom of the plan file (see the template's
"Task breakdown" section).

Good tasks are:

- **Small** — ideally each is a single focused commit.
- **Ordered** — earlier tasks set up context for later ones.
- **Verifiable** — you can tell when each is done (it builds, the page renders,
  the link works).

Example breakdown for "add an RSVP button to event pages":

1. Add `rsvp_url` column to the event data source and loader in `lib/data.ts`.
2. Render an RSVP button component on the event page when `rsvp_url` is present.
3. Style the button to match the site.
4. Update the README with the new data field.

### 3. Implement the tasks

Work through the tasks in order, one at a time.

- Implement one task, then verify it: `npm run build` must succeed, and the
  affected page should render correctly (`npm run dev` for a quick look).
- Respect the [architecture constraints](./architecture.md#design-constraints):
  the site must stay static-exportable, and content should stay data-driven.
- Check off the task in the plan file as you complete it.
- Commit in small, logical increments (only when asked to commit).

When every task is checked off and the change is verified end-to-end, the plan
is done. You may keep the plan file as a record of why the change was made, or
move it to a `docs/planning/done/` folder if you prefer to keep the active list
short.

## Summary

```
Idea  ─▶  docs/planning/<idea>.md  ─▶  task breakdown  ─▶  implement & verify  ─▶  done
        (plan the change)          (small ordered tasks)  (one task at a time)
```
