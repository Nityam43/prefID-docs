"use client";

function setLang(lang: "ts" | "js") {
  document.documentElement.dataset.lang = lang;
  try {
    localStorage.setItem("prefid-lang", lang);
  } catch {
    /* localStorage unavailable */
  }
}

export function LangTabs() {
  return (
    <div className="lang-tabs">
      <button
        type="button"
        data-lang-btn="ts"
        className="lang-btn"
        onClick={() => setLang("ts")}
      >
        TS
      </button>
      <button
        type="button"
        data-lang-btn="js"
        className="lang-btn"
        onClick={() => setLang("js")}
      >
        JS
      </button>
    </div>
  );
}
