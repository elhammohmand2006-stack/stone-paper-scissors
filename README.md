# Stone, Paper, Scissors

A Stone, Paper, Scissors game built with HTML, CSS and vanilla JavaScript. Play best-of-3, 5 or 7 matches against a random computer or one that reads your habits.

**Live demo:** https://YOUR-USERNAME.github.io/stone-paper-scissors/

## Features

- Best of 3, 5 or 7 matches
- Two opponents: **Random** and **Reads your habits** (counters your most-used move 60% of the time)
- Animated countdown ("Stone… Paper… Scissors…") before each reveal
- Green and red highlight for the winner and loser of each round
- History of the last 8 rounds
- Saved stats: best win streak and matches won (localStorage)
- Keyboard shortcuts: **R** (stone), **P** (paper), **S** (scissors)
- Fully responsive: works on phones, tablets and computers

## Built with

- HTML5
- CSS3 (variables, grid, keyframe animations)
- JavaScript (ES6)

## Project structure

```
stone-paper-scissors/
├── index.html   # page structure
├── style.css    # styles and responsive layout
└── script.js    # game logic
```

## How to run

1. Download or clone this repository.
2. Open `index.html` in your browser.

## JavaScript concepts used

- Arrays and objects (`CHOICES`, `BEATS`)
- `Math.random` and `Math.floor`
- Functions with return values and `if / else` conditions
- Loops (`for...of`, `forEach`)
- `setTimeout` for the countdown
- Click and keyboard events
- `localStorage` with `JSON.stringify` and `JSON.parse`

## Credits

Inspired by a class lesson on building Rock Paper Scissors with JavaScript.

## Author

Elham
