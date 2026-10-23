// YOURS TO WRITE. Microphone in, speaker out. Ask me for refreshers on any item below.
//
// Concepts to learn first:
//   - navigator.mediaDevices.getUserMedia({ audio: true })
//   - AudioContext + AudioWorklet (why not ScriptProcessorNode? it's deprecated and runs on the main thread)
//   - Gemini Live wants 16 kHz, 16-bit, mono PCM in; it sends 24 kHz PCM back
//   - Float32 (-1..1) -> Int16 conversion
//   - AnalyserNode / RMS for the 0..1 level that drives the orb
//
// Contract with the rest of the app:

/**
 * Start capturing the mic.
 * onFrame(pcm: ArrayBuffer /* Int16 16 kHz mono */, level: number /* 0..1 */) is called per chunk.
 * Returns a function that stops capture.
 */
export async function startMic(onFrame) {
  throw new Error("TODO");
}

/** Queue a chunk of 24 kHz Int16 PCM from the agent for gapless playback. Report its level via onLevel(0..1). */
export function playChunk(pcm, onLevel) {
  throw new Error("TODO");
}

/** Barge-in: drop everything queued and stop speaking immediately. */
export function stopPlayback() {
  throw new Error("TODO");
}
