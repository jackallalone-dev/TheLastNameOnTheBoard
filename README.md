# The Last Name On The Board

A dependency-free browser trivia game built with HTML, CSS, and JavaScript.

## Play

Open `index.html` in any modern browser.

For a local server, from this folder run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Game loop

- Each round starts with eight surnames.
- Read a clue and click the matching surname.
- A correct answer is eliminated from the board.
- A wrong answer costs one life and resets the streak.
- After seven eliminations, the final clue asks you to confirm the one surviving surname.
- Clear all four rounds to win.

## Scoring

- Standard correct answer: 100 points.
- Final surviving name: 350 points.
- Streak bonus: +15 points per streak step, capped after 10 steps.
- Round clear bonus: 500 points + 100 for each life remaining.
- Best score is saved in `localStorage`.

## Files

- `index.html` — page structure and dialogs
- `styles.css` — responsive visual design and animations
- `game.js` — game data, state, scoring, and interactions
