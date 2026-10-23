// Fake session so the UI can be built and tested before the backend and audio exist.
// Delete this file once socket.js and audio.js work.

const SCRIPT = [
  { role: "user", text: "I spent forty two dollars on groceries today", ms: 2500 },
  { role: "agent", text: "Got it. Forty two dollars on groceries, logged for today.", ms: 3000,
    row: { category: "Groceries", note: "Groceries", amount: 42 } },
  { role: "user", text: "And twelve fifty for lunch", ms: 2000 },
  { role: "agent", text: "Lunch, twelve fifty. That puts food at fifty four fifty this month.", ms: 3500,
    row: { category: "Eating out", note: "Lunch", amount: 12.5 } },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function startMock(ui) {
  let stopped = false;
  let noise = null;

  async function run() {
    ui.setConnected(true);
    for (const step of SCRIPT) {
      if (stopped) return;
      const speaking = step.role === "agent";
      ui.setState(speaking ? "thinking" : "listening");
      await sleep(speaking ? 900 : 400);
      ui.setState(speaking ? "speaking" : "listening");

      // fake audio level while "talking"
      noise = setInterval(() => ui.setLevel(0.2 + Math.random() * 0.7), 70);

      // stream words in gradually
      const words = step.text.split(" ");
      for (let i = 1; i <= words.length; i++) {
        if (stopped) return;
        ui.addTranscript(step.role, words.slice(0, i).join(" "), i === words.length);
        await sleep(step.ms / words.length);
      }
      clearInterval(noise);
      ui.setLevel(0);
      if (step.row) ui.addLedgerRow(step.row);
      await sleep(600);
    }
    ui.setState("listening");
  }

  run();
  return () => {
    stopped = true;
    clearInterval(noise);
    ui.setLevel(0);
    ui.setConnected(false);
    ui.setState("idle");
  };
}
