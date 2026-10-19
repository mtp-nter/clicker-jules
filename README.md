# Cookie Clicker Web Application

A simple, responsive web application featuring a centered clickable cookie with a click counter, smooth animations, score persistence via `localStorage`, a basic client-side tamper deterrent, and a reset option.

## Files Structure

- `index.html`: The main web page structure and CSS styling.
- `script.js`: JavaScript logic managing click events (mouse and keyboard), animations, score persistence (`localStorage` with HTTP cookie migration), checksum validation, and context menu / shortcut blocking.
- `README.md`: Project documentation.

## Features

- **Interactive Cookie**: A centered custom SVG cookie that scales and reacts on click and hover.
- **Click Counter**: Real-time click counter displaying the total number of times the cookie has been clicked.
- **Click Effects**: Floating `+1` particle animations that appear on each click.
- **Keyboard Support**: The cookie can be focused (`tabindex="0"`) and activated with `Enter` or `Space`.
- **Score Persistence**: Stores and retrieves click counts using `localStorage` (`click_count`), which works both over HTTP and when opening the file directly (`file://`). Counts previously stored in HTTP cookies are migrated automatically.
- **Basic Tamper Deterrent**: A checksum signature (`click_sig`) stored alongside `click_count` detects naive manual edits of the score (including negative values or invalid formats), resetting the score to zero. **Note:** since the algorithm lives in client-side code, it is trivially bypassed by editing both values in DevTools — it is not real security and is only intended as a casual deterrent. The shortcut/context-menu blocking follows the same spirit.
- **Reset Button**: Allows resetting the cookie click counter back to zero and erasing stored data.
- **Responsive & Modern UI**: Built with HTML, CSS, and clean modular JavaScript (`script.js`). The page scrolls gracefully on small viewports instead of clipping content.

## Usage

Open `index.html` directly (double-click) or serve it over HTTP — e.g. `python -m http.server` — and start clicking the cookie!
