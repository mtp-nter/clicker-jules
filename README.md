# Cookie Clicker Web Application

A simple, responsive web application featuring a centered clickable cookie with a click counter, smooth animations, HTTP cookie persistence (`document.cookie`), client-side security protections, and a reset option.

## Files Structure

- `index.html`: The main web page structure and CSS styling.
- `script.js`: JavaScript logic managing click events, animations, cookie persistence (`click_count`), checksum validation, and context menu / shortcut blocking.
- `README.md`: Project documentation.

## Features

- **Interactive Cookie**: A centered custom SVG cookie that scales and reacts on click and hover.
- **Click Counter**: Real-time click counter displaying the total number of times the cookie has been clicked.
- **Click Effects**: Floating `+1` particle animations that appear on each click.
- **Cookie Persistence**: Stores and retrieves click counts using browser HTTP cookies (`click_count`), persisting across sessions.
- **Client-Side Protections**:
  - **Context Menu Blocking**: Disables right-click menu to prevent inspecting elements via context menu.
  - **DevTools Shortcut Blocking**: Intercepts shortcuts such as `F12`, `Ctrl+Shift+I/J/C`, `Ctrl+U`, and Mac equivalents (`Cmd+Option+I/J/C/U`).
  - **Cookie Tamper Protection**: Uses a checksum signature (`click_sig`) stored alongside `click_count`. If a user manually edits `click_count` without updating the valid signature, tampering is detected and the score resets to zero.
- **Reset Button**: Allows resetting the cookie click counter back to zero and erasing stored cookies.
- **Responsive & Modern UI**: Built with HTML, CSS, and clean modular JavaScript (`script.js`).

## Usage

Simply open `index.html` in any modern web browser to start clicking the cookie!
