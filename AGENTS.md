# Conte - Vanilla Web Game

Simple countdown number-finding game. No build tools, no package manager, no tests.

## Run locally

Open `index.html` directly in a browser, or serve the directory:

```bash
npx serve .
# or
python3 -m http.server
```

## Project structure

```
├── index.html   # Main HTML (4 screens: setup, countdown, game, results)
├── script.js    # Game logic (~180 lines, vanilla JS)
├── style.css    # Styling with CSS variables
└── README.md    # One-line description
```

## Key implementation details

- **Screens**: Managed via `.screen[hidden]` CSS rule (line 41-43 in style.css)
- **Grid**: Dynamic N×N, numbers 1..N² shuffled, click to mark/unmark
- **Timer**: Countdown from user input, auto-ends game at 0
- **State**: All in `script.js` top-level variables (gridSize, totalSeconds, difficulty, selectionOrder array, easyColorMap)

## Difficulty levels

Selected via radio buttons on setup screen; applied via `body.difficulty-{easy|medium|hard}` class:
- **easy**: Each marked cell gets a random RGB color (with auto-contrasting text via `isLight()`); color persists until unmarked or game ends
- **medium**: Default `.cell.found` gray shading + strikethrough
- **hard**: Transient `press-flash` animation (0.85s) on click, NO persistent mark — player must remember order

## Selection order (validation)

`selectionOrder` is an array, not a Set. Results screen shows numbers in click order (not sorted), so players see exactly the sequence they pressed — including mistakes.

## No tooling

- No lint, typecheck, test, or build commands
- No CI/CD, no dependencies
- Edit files directly, reload browser to verify

## Conventions

- Spanish UI text (game is "Cuenta Regresiva")
- CSS custom properties for colors (`--black`, `--white`, `--gray`, `--light-gray`)
- Event listeners attached at module load time
- `clamp()` for responsive cell font sizing