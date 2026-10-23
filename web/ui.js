// Everything visual. Knows nothing about audio or sockets: other modules call these functions.

const $ = (id) => document.getElementById(id);

const STRINGS = {
  en: {
    eyebrow: "Accountant",
    idle: "Tap the microphone to start",
    listening: "Listening…",
    thinking: "Thinking…",
    speaking: "Speaking…",
    online: "Connected · Gemini Live",
    offline: "Offline",
    month: "This month's spending",
  },
  ar: {
    eyebrow: "المحاسب",
    idle: "اضغط على الميكروفون للبدء",
    listening: "أستمع…",
    thinking: "أفكر…",
    speaking: "أتحدث…",
    online: "متصل · Gemini Live",
    offline: "غير متصل",
    month: "مصروفات هذا الشهر",
  },
};

export function createUI() {
  const app = document.querySelector(".app");
  const transcript = $("transcript");
  const ledger = $("ledger");
  let level = 0;       // smoothed value written to --level
  let target = 0;      // latest raw value from audio
  let total = 0;
  let timerId = null;
  let partial = null;  // the in-progress message element
  let lang = "en";     // one choice drives both the screen text and the language ABE speaks
  let state = "idle";
  let connected = false;
  let langListener = null;

  // Re-render every piece of static text for the current language.
  function renderText() {
    const t = STRINGS[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    $("eyebrow").firstChild.textContent = `${t.eyebrow} `;
    $("state-label").textContent = t[state];
    $("status-text").textContent = connected ? t.online : t.offline;
    $("month-title").textContent = t.month;
    document.querySelectorAll("#lang-btn span").forEach((s) => s.classList.toggle("on", s.dataset.l === lang));
  }

  // Smooth the orb: rise fast, fall slow, like a VU meter.
  function frame() {
    level += (target - level) * (target > level ? 0.35 : 0.08);
    app.style.setProperty("--level", level.toFixed(3));
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  $("grabber").onclick = () => $("sheet").classList.toggle("open");
  initTheme();

  // Saved choice wins; default English. Storage can throw (private windows), so guard it.
  try { lang = localStorage.getItem("lang") === "ar" ? "ar" : "en"; } catch {}
  renderText();
  $("lang-btn").onclick = () => {
    lang = lang === "en" ? "ar" : "en";
    try { localStorage.setItem("lang", lang); } catch {}
    renderText();
    langListener?.(lang);
  };

  return {
    /** state: "idle" | "listening" | "thinking" | "speaking" */
    setState(next) {
      state = next;
      app.dataset.state = next;
      $("state-label").textContent = STRINGS[lang][next];
      if (next === "idle") target = 0;
    },

    /** fn("en" | "ar") runs when the user switches language. The backend must switch ABE's voice too. */
    onLanguage(fn) { langListener = fn; },
    getLanguage() { return lang; },

    /** level: 0..1, call it every audio frame */
    setLevel(v) {
      target = Math.min(1, Math.max(0, v));
    },

    setConnected(on) {
      connected = on;
      app.classList.toggle("live", on);
      $("status-text").textContent = on ? STRINGS[lang].online : STRINGS[lang].offline;
      clearInterval(timerId);
      if (!on) return;
      const start = Date.now();
      timerId = setInterval(() => {
        const s = Math.floor((Date.now() - start) / 1000);
        $("timer").textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      }, 1000);
    },

    /** Streaming text: call with final=false while words arrive, final=true to settle. */
    addTranscript(role, text, final) {
      if (!partial || partial.dataset.role !== role) {
        partial = document.createElement("div");
        partial.className = `msg ${role}`;
        partial.dataset.role = role;
        transcript.append(partial);
      }
      partial.textContent = text;
      partial.classList.toggle("partial", !final);
      if (final) partial = null;
      transcript.scrollTop = transcript.scrollHeight;
    },

    addLedgerRow({ category, note, amount }) {
      const li = document.createElement("li");
      li.className = "row";
      li.innerHTML = `<div><div>${escapeHtml(note)}</div><div class="cat">${escapeHtml(category)}</div></div>
                      <div class="amt">$${amount.toFixed(2)}</div>`;
      ledger.prepend(li);
      total += amount;
      $("total").textContent = `$${total.toFixed(2)}`;
      navigator.vibrate?.(15);
    },

    onTalk(fn) { $("talk-btn").onclick = fn; },
    onEnd(fn) { $("end-btn").onclick = fn; },
    onMute(fn) {
      $("mute-btn").onclick = () => {
        const muted = $("mute-btn").classList.toggle("muted");
        fn(muted);
      };
    },
  };
}

// Saved choice wins; otherwise follow the OS. Storage can throw (private windows), so guard it.
function initTheme() {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const apply = (t) => {
    root.dataset.theme = t;
    meta.content = t === "dark" ? "#000000" : "#b9d0d4";
  };
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch {}
  apply(saved ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  $("theme-btn").onclick = () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem("theme", next); } catch {}
  };
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}
