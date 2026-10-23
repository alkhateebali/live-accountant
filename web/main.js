import { createUI } from "./ui.js";
import { startMock } from "./mock.js";
// import { startMic, playChunk, stopPlayback } from "./audio.js";
// import { connect } from "./socket.js";

const USE_MOCK = true; // flip to false once audio.js and socket.js are yours

const ui = createUI();
let stop = null;

ui.onTalk(() => {
  if (stop) return;
  if (USE_MOCK) {
    stop = startMock(ui);
    return;
  }
  // TODO: wire real session:
  //   const socket = connect(url, { onAudio, onTranscript, onToolResult, onState });
  //   startMic((pcm, level) => { socket.sendAudio(pcm); ui.setLevel(level); });
});

ui.onEnd(() => {
  stop?.();
  stop = null;
});

ui.onMute((muted) => {
  // TODO: tell audio.js to stop sending mic frames while muted
  console.log("muted:", muted);
});
