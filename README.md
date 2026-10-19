# Cookie Clicker Web Application

A simple, responsive web application featuring a centered clickable cookie with a click counter, smooth animations, HTTP cookie persistence (`document.cookie`), an achievement system with trophies, and a reset option.

## Files Structure

- `index.html`: The main web page structure and CSS styling including counter, cookie, trophies, and reset button.
- `script.js`: JavaScript logic managing click events, animations, achievement tracking, and cookie-based persistence (`click_count`).
- `verification/`: Playwright end-to-end integration and verification tests for the application.
- `README.md`: Project documentation.

## Features

- **Interactive Cookie**: A centered custom SVG cookie that scales and reacts on click and hover.
- **Click Counter**: Real-time click counter displaying the total number of times the cookie has been clicked.
- **Achievement System**: Unlock trophy achievements when reaching milestones:
  - 🥉 **Bronze Cookie**: Unlocked at 10 clicks
  - 🥈 **Silver Cookie**: Unlocked at 100 clicks
  - 🥇 **Gold Cookie**: Unlocked at 1000 clicks
- **Click Effects**: Floating `+1` particle animations that appear on each click.
- **Cookie Persistence**: Stores and retrieves click counts using browser HTTP cookies (`click_count`), persisting click counts and unlocked trophies across sessions.
- **Reset Button**: Allows resetting the cookie click counter back to zero, erasing cookies, and resetting achievements.
- **Responsive & Modern UI**: Built with HTML, CSS, and clean modular JavaScript (`script.js`).

## Usage

Simply open `index.html` in any modern web browser to start clicking the cookie!
