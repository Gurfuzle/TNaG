Generate a themed Bulk Buy description for the Corporate Magic League Google Form.

Argument: $ARGUMENTS — the set name (required), optionally followed by `--price XX` to override the default bulk buy price.

Examples:
- `/generate-bulk-buy Secrets of Strixhaven` — generate with default pricing ($54)
- `/generate-bulk-buy Marvel Super Heroes --price 60` — generate with $60 price
- `/generate-bulk-buy Lorwyn Eclipsed` — generate with default pricing

## Instructions

Read the skill files at `~/.claude/skills/mtg-league-generator/` for context — especially `SKILL.md` for the date formula and pricing logic, and `examples/bulk-buy-lorwyn-eclipsed.md` for the reference example.

### Step 1: Parse Arguments
- Extract set name from $ARGUMENTS (everything before `--price` if present)
- Extract optional `--price XX` override

### Step 2: Research the Set
- Web search for the set's **release date**, **prerelease dates**, **themes, mechanics, lore, and flavor**
- Determine if set is **Universes Beyond** (crossover IP) or **in-universe**

### Step 3: Determine Pricing
- In-universe default: $54
- Universes Beyond default: $60
- Use `--price` override if provided

### Step 4: Calculate Dates
Using the release date (typically a Friday):
- **Bulk Buy Cutoff** = Wednesday before prerelease at NOON (release date - 9 days)
- **Product Pickup Available** = Prerelease Friday (release date - 7 days)

### Step 5: Generate the Bulk Buy Description

Rewrite the bulk buy description with **set-appropriate flavor and theme** (matching the tone of the main league description). The description MUST include ALL of the following information — do not omit any item:

**Required Information Checklist:**
- [ ] What you get: **twelve play boosters** (open six to start the league, the rest are opened throughout the league)
- [ ] **Price** ($54 / $60 / override)
- [ ] **Payment methods**: Venmo **Michael-Swensen-2** or PayPal **gurfuzle@hotmail.com**
- [ ] If you do NOT join the bulk buy but are in the league, you must **purchase twelve play boosters on your own**
- [ ] **Pickup option 1**: Pick up product yourself from **Game Grid in Lehi**
- [ ] **Pickup option 2**: Coordinate with **Mike Swensen** to get product somewhere else
- [ ] **Coordinate caveat**: Only choose "coordinate" if someone is picking up all product for your company, or you have communicated with Mike directly before signing up
- [ ] **Bulk buy cutoff**: specific date **at noon**
- [ ] **Product available for pickup**: the Friday after cutoff (prerelease Friday), from Game Grid

### Step 6: Output Two Versions
1. **Markdown** — with formatting for reference
2. **Plain-text** — Google Forms-friendly, with emoji section headers for visual structure

### Step 7: Copy to Clipboard
Copy the plain-text version to clipboard via `pbcopy`. Tell the user it's ready to paste.
