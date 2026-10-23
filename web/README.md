# Accountant ABE: web frontend

Vanilla JavaScript voice UI for the live accountant. No build step, no dependencies.

## Run

```
cd web
python3 -m http.server 8000
```

Open <http://localhost:8000> and tap the mic. It runs a scripted mock conversation, so the UI works without the backend.

## Files

| File | Role |
|------|------|
| `index.html` | Markup: header, orb, controls, ledger sheet |
| `style.css` | Both themes, orb animations, mic rings |
| `ui.js` | Everything visual: states, orb level, ledger rows, theme and language |
| `mock.js` | Fake session (streaming text, audio level, ledger rows) |
| `main.js` | Wires the pieces. `USE_MOCK = true` until the real session exists |
| `audio.js` | Stub: microphone capture and playback (`startMic`, `playChunk`, `stopPlayback`) |
| `socket.js` | Stub: WebSocket to the FastAPI service in `live_adk/` (`connect`) |

`audio.js` and `socket.js` document their own contracts and the concepts to learn first.

## UI API (`ui.js`)

`createUI()` returns:

- `setState("idle" | "listening" | "thinking" | "speaking")`
- `setLevel(0..1)`: call every audio frame; drives the orb and the mic rings
- `setConnected(boolean)`: status pill and session timer
- `addTranscript(role, text, final)`: streaming text (the transcript is hidden for now; remove `hidden` from `#transcript` in `index.html` to show it)
- `addLedgerRow({ category, note, amount })`
- `onTalk`, `onEnd`, `onMute`: button callbacks
- `onLanguage(fn)`, `getLanguage()`: `"en"` or `"ar"`

## Themes and language

- **Theme:** the half-moon button toggles light and dark. The choice is saved, and the default follows the OS. Only background and text colours differ between the two.
- **Language:** the EN/AR toggle switches the screen text and layout direction (right-to-left for Arabic). It must also switch the language ABE speaks, so the backend has to receive it through `onLanguage`. Not wired yet.

## Going live

1. Write `audio.js` and `socket.js`.
2. In `main.js`, set `USE_MOCK = false` and fill in the `TODO` block.
3. Delete `mock.js`.

## Credits

The look and orb motion are based on the Figma Community file "AI Voice Interaction App" by Nessi.Huang, licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). This project recreates the design in CSS and does not include the original assets.

Arabic text uses [IBM Plex Sans Arabic](https://fonts.google.com/specimen/IBM+Plex+Sans+Arabic) from Google Fonts.
