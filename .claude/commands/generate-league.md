Generate a Corporate Magic League description for a Magic: The Gathering set.

Argument: $ARGUMENTS — the set name (required), optionally followed by `--price XX` to override the default bulk buy price.

Examples:
- `/generate-league Secrets of Strixhaven` — generate with default pricing
- `/generate-league Marvel Super Heroes --price 60` — generate with $60 price for Universes Beyond
- `/generate-league Lorwyn Eclipsed` — generate with default pricing

Use the `mtg-league-generator` skill to execute this command. Follow all instructions in the skill's SKILL.md, including:

1. Parse the set name and optional price from $ARGUMENTS
2. Web search for release date, prerelease dates, themes, mechanics, lore
3. Determine pricing (default $54 in-universe, $60 Universes Beyond, or use --price override)
4. Calculate all dates using the fixed formula
5. Generate a creative, themed description with ALL required logistics
6. Output both markdown and plain-text Google Forms versions
7. Copy the plain-text version to clipboard via pbcopy
