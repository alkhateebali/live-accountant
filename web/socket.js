// YOURS TO WRITE. The WebSocket between the browser and the FastAPI service in live_adk/.
// The matching endpoint doesn't exist yet (backend step 2), so design the message format together.
//
// Concepts to learn first:
//   - new WebSocket(url); ws.binaryType = "arraybuffer"
//   - binary frames for audio, JSON text frames for everything else
//   - reconnect with backoff, and what to do with mic frames while disconnected
//
// Suggested contract (change it if you prefer):
//   browser -> server: binary = mic PCM; JSON {type:"end"}
//   server -> browser: binary = agent PCM
//                      JSON {type:"transcript", role:"user"|"agent", text, final:boolean}
//                      JSON {type:"state", value:"listening"|"thinking"|"speaking"}
//                      JSON {type:"ledger", category, note, amount}
//                      JSON {type:"interrupted"}   // barge-in: call stopPlayback()

/**
 * handlers: { onAudio(ArrayBuffer), onTranscript(role, text, final), onState(s), onLedger(row), onInterrupted(), onClose() }
 * Returns { sendAudio(ArrayBuffer), close() }.
 */
export function connect(url, handlers) {
  throw new Error("TODO");
}
