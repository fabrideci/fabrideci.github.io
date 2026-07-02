---
name: <kebab-case-name>
description: Use when <the exact situation that should trigger this skill> — <what it does>. The description IS the trigger; write it as the condition to match on, not a summary of features.
user-invocable: false   # set true to expose it as a /<name> slash command
---

# <Skill Name>

<One or two sentences: what this skill is for and the outcome it produces.>

## When to use

- <Concrete trigger — a phrasing or situation that should invoke this.>
- <A second trigger.>
- Not for <the adjacent case this skill should NOT handle> — use <other skill> instead.

## Inputs

| Input | Required | Example |
|-------|----------|---------|
| <name> | yes / no | <example value> |

## Workflow

1. <First concrete action.>
2. <Second step.>
3. <How it ends — what it returns or produces.>

Keep this body short. Push long procedures, lookup tables, and worked examples
into `references/<topic>.md` and link them below — the model loads a reference
only when it actually needs it (progressive disclosure), so the base skill stays
cheap to carry.

## References

- [references/<topic>.md](references/<topic>.md) — <what's in it and when to read it>.

## Guardrails

- Read-only by default.
- Anything destructive or outward-facing — writes, sends, deletes, pushes — must
  stop and ask for explicit approval first. Propose; don't act unattended.
