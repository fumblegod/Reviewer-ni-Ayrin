"use client";
import { useState, useEffect, useRef } from "react";

const TOPICS = [
  { id: "micropara", label: "Micro & Parasitology", icon: "🦠", featured: true },
  { id: "med-surg", label: "Med-Surg", icon: "🏥" },
  { id: "pharmacology", label: "Pharmacology", icon: "💊" },
  { id: "ob", label: "OB / Maternity", icon: "🤱" },
  { id: "pediatrics", label: "Pediatrics", icon: "🧒" },
  { id: "psych", label: "Psych / Mental Health", icon: "🧠" },
  { id: "fundamentals", label: "Fundamentals", icon: "📋" },
  { id: "critical-care", label: "Critical Care", icon: "❤️‍🔥" },
  { id: "community", label: "Community Health", icon: "🌍" },
];

const MICROPARA_SUBTOPICS = [
  { id: "all", label: "All MicroPara" },
  { id: "bacteria", label: "🧫 Bacteria" },
  { id: "viruses", label: "🦠 Viruses" },
  { id: "fungi", label: "🍄 Fungi" },
  { id: "parasites", label: "🪱 Parasites" },
  { id: "antibiotics", label: "💉 Antibiotics & Tx" },
  { id: "infection-control", label: "🧤 Infection Control" },
];

const DIFFICULTY = ["NCLEX-RN", "NCLEX-PN", "Advanced Practice"];

const THEMES = [
  { id: "classic", label: "Classic" },
  { id: "ocean", label: "Ocean" },
  { id: "pink", label: "Pink" },
  { id: "blush", label: "Blush" },
];

const THEME_COLORS = {
  classic: {
    bg: "#060b14",
    panel: "#0a0f1a",
    panelAlt: "#0f172a",
    border: "#1e293b",
    text: "#e2e8f0",
    muted: "#64748b",
    muted2: "#475569",
    subtle: "#94a3b8",
    dim: "#334155",
    accent: "#4ade80",
    accentText: "#060b14",
    infoBg: "#1e3a5f",
    infoText: "#93c5fd",
    infoBorder: "#3b82f6",
    successBg: "#052e16",
    dangerBg: "#2d0a0a",
    success: "#4ade80",
    warn: "#facc15",
    danger: "#f87171",
    dangerBorder: "#7f1d1d",
    flashAccent: "#8b5cf6",
    flashAccentBg: "#7c3aed",
    flashAccentSoft: "#ddd6fe",
    flashCardBack: "#1e1b4b",
    flashShadow: "rgba(124, 58, 237, 0.2)",
  },
  ocean: {
    bg: "#041317",
    panel: "#082229",
    panelAlt: "#0c3039",
    border: "#1d4b59",
    text: "#ddf7ff",
    muted: "#6ba0ad",
    muted2: "#4f7f8d",
    subtle: "#9fd0db",
    dim: "#325763",
    accent: "#5eead4",
    accentText: "#022a26",
    infoBg: "#113b4d",
    infoText: "#8be9ff",
    infoBorder: "#38bdf8",
    successBg: "#0b3b2f",
    dangerBg: "#3b1a1f",
    success: "#2dd4bf",
    warn: "#fbbf24",
    danger: "#fb7185",
    dangerBorder: "#7f1d2d",
    flashAccent: "#22d3ee",
    flashAccentBg: "#0891b2",
    flashAccentSoft: "#cffafe",
    flashCardBack: "#0f3b4d",
    flashShadow: "rgba(14, 165, 233, 0.22)",
  },
  pink: {
    bg: "#220c1b",
    panel: "#34122a",
    panelAlt: "#4a1b3a",
    border: "#85406e",
    text: "#ffe9f7",
    muted: "#d093b8",
    muted2: "#b8789f",
    subtle: "#f5c1e1",
    dim: "#9d5a86",
    accent: "#ff61c2",
    accentText: "#2a1023",
    infoBg: "#6b2256",
    infoText: "#ffcaec",
    infoBorder: "#ff80cf",
    successBg: "#542045",
    dangerBg: "#56142c",
    success: "#ff83d2",
    warn: "#ffd166",
    danger: "#ff85a4",
    dangerBorder: "#a32d58",
    flashAccent: "#ff61c2",
    flashAccentBg: "#e13da5",
    flashAccentSoft: "#ffd6f1",
    flashCardBack: "#5b2148",
    flashShadow: "rgba(255, 97, 194, 0.3)",
  },
  blush: {
    bg: "#fff0fa",
    panel: "#ffe8f5",
    panelAlt: "#ffd8ed",
    border: "#f0a9d3",
    text: "#592b4a",
    muted: "#ab668f",
    muted2: "#bf77a0",
    subtle: "#8f4f78",
    dim: "#cc8db4",
    accent: "#ec3f9f",
    accentText: "#ffffff",
    infoBg: "#f6c8e5",
    infoText: "#842f64",
    infoBorder: "#de73b0",
    successBg: "#f8cfe8",
    dangerBg: "#ffd2e2",
    success: "#c43182",
    warn: "#d88a3f",
    danger: "#d83f79",
    dangerBorder: "#d65b90",
    flashAccent: "#dd479d",
    flashAccentBg: "#cf2e8f",
    flashAccentSoft: "#fff7fc",
    flashCardBack: "#ffd3eb",
    flashShadow: "rgba(221, 71, 157, 0.22)",
  },
};

function getPerfColor(pct, colors) {
  if (pct === null || pct === undefined) return colors.dim;
  if (pct >= 75) return colors.success;
  if (pct >= 60) return colors.warn;
  return colors.danger;
}

const MICRO_QUICK_REF = [
  { organism: "S. aureus", type: "🧫", key: "Gram+ cocci clusters. MRSA → vancomycin. Toxin-mediated: TSS, scalded skin, food poisoning." },
  { organism: "S. pneumoniae", type: "🧫", key: "Gram+ diplococci. Leading cause of CAP, meningitis, otitis media. Tx: penicillin (or ceftriaxone if resistant)." },
  { organism: "E. coli", type: "🧫", key: "Gram− rod. #1 UTI, neonatal meningitis. EHEC O157:H7 → HUS. No antibiotics for EHEC." },
  { organism: "N. meningitidis", type: "🧫", key: "Gram− diplococci. Petechial/purpuric rash. Droplet precautions. Tx: penicillin G. Prophylaxis: rifampin." },
  { organism: "M. tuberculosis", type: "🧫", key: "Acid-fast bacillus. Airborne precautions (N95). RIPE therapy: Rifampin, INH, Pyrazinamide, Ethambutol." },
  { organism: "C. difficile", type: "🧫", key: "Gram+ rod, spore-forming. Contact precautions + soap & water (NOT hand sanitizer). Tx: vancomycin PO or fidaxomicin." },
  { organism: "HIV", type: "🦠", key: "Retrovirus. CD4 <200 = AIDS. Standard precautions. ART therapy. Opportunistic: PCP, CMV, MAC, Toxoplasma." },
  { organism: "Hepatitis B", type: "🦠", key: "Blood/sexual/perinatal. Standard precautions. Vaccine-preventable. HBsAg = active infection." },
  { organism: "Influenza", type: "🦠", key: "Droplet precautions. Tx: oseltamivir (Tamiflu) within 48h. Annual vaccine." },
  { organism: "Candida albicans", type: "🍄", key: "Opportunistic. Thrush, vaginitis, systemic in immunocompromised. Tx: fluconazole (topical: nystatin)." },
  { organism: "Aspergillus", type: "🍄", key: "Mold. Immunocompromised risk. Tx: voriconazole. Avoid construction sites." },
  { organism: "Plasmodium", type: "🪱", key: "Malaria. Anopheles mosquito. P. falciparum most deadly. Tx: chloroquine (if sensitive) or artemisinin." },
  { organism: "Toxoplasma gondii", type: "🪱", key: "Cat feces/undercooked meat. Danger in pregnancy (congenital). AIDS defining. Tx: pyrimethamine + sulfadiazine." },
  { organism: "Giardia lamblia", type: "🪱", key: "Fecal-oral, contaminated water. Greasy, foul-smelling diarrhea. Tx: metronidazole." },
  { organism: "Ascaris lumbricoides", type: "🪱", key: "Largest intestinal roundworm. Fecal-oral. Tx: albendazole or mebendazole." },
];

function generatePrompt(topic, difficulty, previousQuestions, subtopic, customTopic, customContext = "") {
  const topicLabel = TOPICS.find((t) => t.id === topic)?.label || topic;
  const focus = customTopic ? `specifically about: ${customTopic}` : `about ${topicLabel}`;
  
  const avoid = previousQuestions.length > 0
    ? `Do not repeat these questions: ${previousQuestions.slice(-5).join(" | ")}`
    : "";

  const reference = customContext ? `\nIMPORTANT REFERENCE MATERIAL:\n"""\n${customContext}\n"""\nBase your question off the reference material provided above, prioritizing the concepts and details within it.` : "";

  let instructions = `You are an expert nursing educator creating ${difficulty} exam questions.
Generate ONE multiple-choice nursing question ${focus}.`;

  if (topic === "micropara" && !customTopic) {
    instructions = `You are an expert microbiology & parasitology nursing educator. Generate a clinical NCLEX-style question focused on: ${subtopic === "all" ? "any microbiology or parasitology topic" : subtopic}.

Question types to rotate through (pick one that fits):
- Patient presents with symptoms → identify the most likely organism
- Which antibiotic/antifungal/antiparasitic is first-line treatment?
- Mechanism of pathogen virulence or immune evasion
- Nurse priority action for a patient with a specific infection
- Infection control precautions for a specific organism
- Travel-related or opportunistic infection scenarios
- Lab findings / culture results interpretation

Include the organism name and relevant clinical details. Make it clinically realistic.`;
  }

  return `${instructions}
${reference}
${avoid}

Respond ONLY with valid JSON, no markdown, no code fences, no explanation:
{
  "question": "...",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "correct": 0,
  "rationale": "Detailed clinical rationale explaining why the answer is correct and why the others are wrong.",
  "topic": "${topicLabel}",
  "difficulty": "${difficulty}"
}`;
}

function generateFlashcardPrompt(topic, difficulty, previousCards, customTopic, customContext = "") {
  const topicLabel = TOPICS.find((t) => t.id === topic)?.label || topic;
  const focus = customTopic ? `focusing mainly on: ${customTopic}` : `about ${topicLabel}`;
  const avoid = previousCards.length > 0
    ? `Do not repeat these concepts: ${previousCards.slice(-5).join(" | ")}`
    : "";
  
  const reference = customContext ? `\nIMPORTANT REFERENCE MATERIAL:\n"""\n${customContext}\n"""\nBase your flashcard on the concepts and details provided in the reference material above.` : "";

  return `You are an expert nursing educator creating ${difficulty} flashcards.
Generate ONE flashcard ${focus}. Make the front concise and the back informative.
${reference}
${avoid}

Respond ONLY with valid JSON, no markdown, no code fences, no explanation:
{
  "front": "Concept, condition, term, or short question",
  "back": "Detailed definition, key points, pathophysiology, or answer"
}`;
}

async function fetchFromAI(prompt) {
  const res = await fetch("/api/question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// ── Sparkline ─────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const w = 80, h = 28, pad = 2;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r="2.5" fill={color} />
    </svg>
  );
}

// ── MicroPara Quick Reference ─────────────────────────────────────
function MicroCheatSheet({ colors }) {
  const [filter, setFilter] = useState("all");
  const types = ["all", "🧫", "🦠", "🍄", "🪱"];
  const typeLabels = { all: "All", "🧫": "Bacteria", "🦠": "Viruses", "🍄": "Fungi", "🪱": "Parasites" };
  const filtered = filter === "all" ? MICRO_QUICK_REF : MICRO_QUICK_REF.filter((r) => r.type === filter);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {types.map((t) => (
          <button key={t} onClick={() => setFilter(t)} style={{
            background: filter === t ? colors.accent : colors.panel,
            color: filter === t ? colors.accentText : colors.muted,
            border: filter === t ? "none" : `1px solid ${colors.border}`,
            borderRadius: 4, padding: "4px 10px", fontSize: 11,
            cursor: "pointer", fontFamily: "monospace",
          }}>{typeLabels[t]}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((r, i) => (
          <div key={i} style={{ background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "10px 14px" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 14 }}>{r.type}</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: colors.accent, fontWeight: 600 }}>{r.organism}</span>
            </div>
            <div style={{ fontSize: 12, color: colors.subtle, lineHeight: 1.6 }}>{r.key}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Notes Panel ───────────────────────────────────────────────────
function NotesPanel({ topic, notes, onSave, colors }) {
  const [text, setText] = useState(notes[topic] || "");
  useEffect(() => setText(notes[topic] || ""), [topic, notes]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "min(60vh, calc(100vh - 220px))" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontFamily: "monospace", color: colors.muted, letterSpacing: 2, textTransform: "uppercase" }}>
          Notes — {TOPICS.find((t) => t.id === topic)?.label}
        </span>
        <button onClick={() => onSave(topic, text)} style={{
          background: colors.panelAlt, color: colors.accent, border: `1px solid ${colors.accent}`,
          borderRadius: 4, padding: "3px 10px", fontSize: 11, cursor: "pointer", fontFamily: "monospace",
        }}>SAVE</button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Type your ${TOPICS.find((t) => t.id === topic)?.label} notes here…\n\nTry: key medications, lab values, mnemonics, priority rules…`}
        style={{
          flex: 1, background: colors.panel, color: colors.text, border: `1px solid ${colors.border}`,
          borderRadius: 6, padding: 12, fontFamily: "monospace", fontSize: 13,
          lineHeight: 1.7, resize: "none", outline: "none",
        }}
      />
    </div>
  );
}

// ── Progress Panel ────────────────────────────────────────────────
function ProgressPanel({ progress, colors }) {
  const topics = TOPICS.map((t) => {
    const data = progress[t.id] || { correct: 0, total: 0, history: [] };
    const pct = data.total ? Math.round((data.correct / data.total) * 100) : null;
    return { ...t, ...data, pct };
  });
  const overall = topics.reduce((a, t) => ({ c: a.c + t.correct, t: a.t + t.total }), { c: 0, t: 0 });
  const overallPct = overall.t ? Math.round((overall.c / overall.t) * 100) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 11, fontFamily: "monospace", color: colors.muted, letterSpacing: 2, marginBottom: 8 }}>OVERALL PERFORMANCE</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 40, fontWeight: 700, color: getPerfColor(overallPct, colors), fontFamily: "monospace" }}>
            {overallPct !== null ? `${overallPct}%` : "—"}
          </span>
          <span style={{ color: colors.muted, fontSize: 13 }}>{overall.c}/{overall.t} correct</span>
        </div>
        {overall.t > 0 && (
          <div style={{ marginTop: 8, height: 4, background: colors.border, borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${overallPct}%`, background: getPerfColor(overallPct, colors), borderRadius: 2, transition: "width .4s" }} />
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {topics.map((t) => (
          <div key={t.id} style={{ background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 16 }}>{t.icon}</div>
                <div style={{ fontSize: 12, color: colors.subtle, marginTop: 2 }}>{t.label}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: getPerfColor(t.pct, colors) }}>
                  {t.pct !== null ? `${t.pct}%` : "—"}
                </div>
                <div style={{ fontSize: 10, color: colors.muted2 }}>{t.correct}/{t.total}</div>
              </div>
            </div>
            {t.history.length > 1 && (
              <div style={{ marginTop: 6 }}>
                <Sparkline data={t.history.map((h) => (h ? 1 : 0)).map((_, i, arr) => arr.slice(0, i + 1).filter(Boolean).length)} color={colors.accent} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Quiz Panel ────────────────────────────────────────────────────
const btnStyle = (colors) => ({
  background: colors.panelAlt,
  color: colors.accent,
  border: `1px solid ${colors.accent}`,
  borderRadius: 6,
  padding: "10px 20px",
  fontSize: 12,
  cursor: "pointer",
  fontFamily: "monospace",
  letterSpacing: 2,
  transition: "all .15s",
});

function QuizPanel({ topic, difficulty, progress, onAnswer, colors }) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState(null);
  const [subtopic, setSubtopic] = useState("all");
  const [customTopic, setCustomTopic] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [contextVal, setContextVal] = useState("");
  const [showContextInput, setShowContextInput] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const prevQuestions = useRef([]);
  const isMicro = topic === "micropara";

  const loadQuestion = async (overrideTopic, overrideContext) => {
    setLoading(true);
    setSelected(null);
    setRevealed(false);
    setError(null);
    try {
      const topicToUse = typeof overrideTopic === "string" ? overrideTopic : customTopic;
      const contextToUse = typeof overrideContext === "string" ? overrideContext : customContext;
      const prompt = generatePrompt(topic, difficulty, prevQuestions.current, subtopic, topicToUse, contextToUse);
      const q = await fetchFromAI(prompt);
      setQuestion(q);
      prevQuestions.current.push(q.question.slice(0, 60));
    } catch (e) {
      setError(e.message || "Could not load question. Check your connection and try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    prevQuestions.current = [];
    loadQuestion(customTopic, customContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, subtopic]);

  const handleCustomTopicSubmit = (e) => {
    e.preventDefault();
    setCustomTopic(inputVal);
    setCustomContext(contextVal);
    prevQuestions.current = [];
    loadQuestion(inputVal, contextVal);
  };

  const handleClearCustom = () => {
    setCustomTopic("");
    setCustomContext("");
    setInputVal("");
    setContextVal("");
    setShowContextInput(false);
    prevQuestions.current = [];
    loadQuestion("", "");
  };

  const stats = progress[topic] || { correct: 0, total: 0 };
  const pct = stats.total ? Math.round((stats.correct / stats.total) * 100) : null;
  const baseBtn = btnStyle(colors);

  const optionColor = (idx) => {
    if (!revealed) return selected === idx ? colors.infoBg : colors.panel;
    if (idx === question.correct) return colors.successBg;
    if (idx === selected && selected !== question.correct) return colors.dangerBg;
    return colors.panel;
  };
  const optionBorder = (idx) => {
    if (!revealed) return selected === idx ? `1px solid ${colors.infoBorder}` : `1px solid ${colors.border}`;
    if (idx === question.correct) return `1px solid ${colors.success}`;
    if (idx === selected && selected !== question.correct) return `1px solid ${colors.danger}`;
    return `1px solid ${colors.border}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stat bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontFamily: "monospace", color: colors.muted, letterSpacing: 2, textTransform: "uppercase" }}>
          {TOPICS.find((t) => t.id === topic)?.icon} {TOPICS.find((t) => t.id === topic)?.label}
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {isMicro && (
            <button onClick={() => setShowCheatSheet(!showCheatSheet)} style={{
              background: showCheatSheet ? colors.accent : "transparent",
              color: showCheatSheet ? colors.accentText : colors.accent,
              border: `1px solid ${colors.accent}`, borderRadius: 4,
              padding: "3px 10px", fontSize: 10, cursor: "pointer", fontFamily: "monospace",
            }}>
              {showCheatSheet ? "← BACK TO QUIZ" : "📋 QUICK REF"}
            </button>
          )}
          <span style={{ fontFamily: "monospace", fontSize: 12, color: getPerfColor(pct, colors) === colors.dim ? colors.muted2 : getPerfColor(pct, colors) }}>
            {pct !== null ? `${pct}% (${stats.correct}/${stats.total})` : "No attempts yet"}
          </span>
        </div>
      </div>

      {/* MicroPara subtopic filter */}
      {isMicro && !showCheatSheet && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {MICROPARA_SUBTOPICS.map((s) => (
            <button key={s.id} onClick={() => setSubtopic(s.id)} style={{
              background: subtopic === s.id ? colors.infoBg : colors.panel,
              color: subtopic === s.id ? colors.infoText : colors.muted2,
              border: subtopic === s.id ? `1px solid ${colors.infoBorder}` : `1px solid ${colors.border}`,
              borderRadius: 4, padding: "4px 10px", fontSize: 11,
              cursor: "pointer", fontFamily: "monospace",
            }}>{s.label}</button>
          ))}
        </div>
      )}

      {/* Custom Topic Focus */}
      {!showCheatSheet && (
        <form onSubmit={handleCustomTopicSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Focus on a specific type or concept (e.g., 'ethics', 'side effects')"
              style={{ flex: 1, background: colors.panel, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 4, padding: "6px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }}
            />
            <button type="button" onClick={() => setShowContextInput(!showContextInput)} style={{ background: showContextInput ? colors.infoBg : colors.panel, color: colors.infoText, border: `1px solid ${colors.infoBorder}`, borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>+ DOCUMENT</button>
            <button type="submit" style={{ background: colors.infoBg, color: colors.infoText, border: `1px solid ${colors.infoBorder}`, borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>FOCUS</button>
            {(customTopic || customContext) && (
              <button type="button" onClick={handleClearCustom} style={{ background: "transparent", color: colors.danger, border: `1px solid ${colors.dangerBorder}`, borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>CLEAR</button>
            )}
          </div>
          {showContextInput && (
            <textarea
              value={contextVal}
              onChange={(e) => setContextVal(e.target.value)}
              placeholder="Paste text from a PDF, document, or lecture notes here. The AI will use this as reference material to generate your question..."
              style={{ width: "100%", height: 100, background: colors.panel, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 4, padding: "8px 12px", fontSize: 12, outline: "none", fontFamily: "inherit", resize: "vertical" }}
            />
          )}
        </form>
      )}

      {/* Cheat sheet */}
      {isMicro && showCheatSheet && <MicroCheatSheet colors={colors} />}

      {/* Quiz content */}
      {!showCheatSheet && loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, padding: "60px 0" }}>
          <div style={{ width: 32, height: 32, border: `2px solid ${colors.border}`, borderTop: `2px solid ${colors.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ color: colors.muted2, fontFamily: "monospace", fontSize: 12 }}>Generating question…</span>
        </div>
      )}

      {!showCheatSheet && error && !loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "60px 0" }}>
          <span style={{ color: colors.danger, fontFamily: "monospace", fontSize: 13, textAlign: "center" }}>{error}</span>
          <button onClick={() => loadQuestion()} style={baseBtn}>RETRY</button>
        </div>
      )}

      {!showCheatSheet && question && !loading && !error && (
        <>
          <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 16, lineHeight: 1.7, color: colors.text, fontSize: 14 }}>
            {question.question}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {question.options.map((opt, idx) => (
              <button key={idx} onClick={() => !revealed && setSelected(idx)} style={{
                background: optionColor(idx), border: optionBorder(idx),
                borderRadius: 6, padding: "10px 14px", color: colors.text, fontSize: 13,
                textAlign: "left", cursor: revealed ? "default" : "pointer",
                transition: "all .15s", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: colors.muted, minWidth: 16 }}>
                  {revealed ? (idx === question.correct ? "✓" : idx === selected && selected !== question.correct ? "✗" : " ") : String.fromCharCode(65 + idx)}
                </span>
                {opt.replace(/^[A-D]\.\s*/, "")}
              </button>
            ))}
          </div>

          {!revealed ? (
            <button onClick={() => { if (selected !== null) { setRevealed(true); onAnswer(topic, selected === question.correct); } }}
              disabled={selected === null} style={{ ...baseBtn, opacity: selected === null ? 0.4 : 1 }}>
              CHECK ANSWER
            </button>
          ) : (
            <>
              <div style={{
                background: selected === question.correct ? colors.successBg : colors.dangerBg,
                border: `1px solid ${selected === question.correct ? colors.success : colors.danger}`,
                borderRadius: 8, padding: 14, fontSize: 13, lineHeight: 1.7, color: colors.text,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 2, color: selected === question.correct ? colors.success : colors.danger, marginBottom: 6 }}>
                  {selected === question.correct ? "✓ CORRECT" : "✗ INCORRECT"} — RATIONALE
                </div>
                {question.rationale}
              </div>
              <button onClick={() => loadQuestion()} style={baseBtn}>NEXT QUESTION →</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ── Flashcard Panel ────────────────────────────────────────────────
function FlashcardPanel({ topic, difficulty, colors }) {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [contextVal, setContextVal] = useState("");
  const [showContextInput, setShowContextInput] = useState(false);
  const [error, setError] = useState(null);
  const prevCards = useRef([]);
  const baseBtn = btnStyle(colors);

  const loadCard = async (overrideTopic, overrideContext) => {
    setLoading(true);
    setFlipped(false);
    setError(null);
    try {
      const topicToUse = typeof overrideTopic === "string" ? overrideTopic : customTopic;
      const contextToUse = typeof overrideContext === "string" ? overrideContext : customContext;
      const prompt = generateFlashcardPrompt(topic, difficulty, prevCards.current, topicToUse, contextToUse);
      const data = await fetchFromAI(prompt);
      setCard(data);
      prevCards.current.push(data.front.slice(0, 60));
    } catch (e) {
      setError(e.message || "Could not load flashcard.");
    }
    setLoading(false);
  };

  useEffect(() => {
    prevCards.current = [];
    loadCard(customTopic, customContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, difficulty]);

  const handleCustomTopicSubmit = (e) => {
    e.preventDefault();
    setCustomTopic(inputVal);
    setCustomContext(contextVal);
    prevCards.current = [];
    loadCard(inputVal, contextVal);
  };

  const handleClearCustom = () => {
    setCustomTopic("");
    setCustomContext("");
    setInputVal("");
    setContextVal("");
    setShowContextInput(false);
    prevCards.current = [];
    loadCard("", "");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontFamily: "monospace", color: colors.muted, letterSpacing: 2, textTransform: "uppercase" }}>
          {TOPICS.find((t) => t.id === topic)?.icon} {TOPICS.find((t) => t.id === topic)?.label} - Flashcards
        </span>
      </div>

      {/* Custom Topic Focus */}
      <form onSubmit={handleCustomTopicSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Focus flashcards on a specific concept (e.g., 'side effects', 'lab values')"
            style={{ flex: 1, background: colors.panel, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 4, padding: "6px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }}
          />
          <button type="button" onClick={() => setShowContextInput(!showContextInput)} style={{ background: showContextInput ? colors.flashAccentBg : colors.panel, color: colors.flashAccentSoft, border: `1px solid ${colors.flashAccent}`, borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>+ DOCUMENT</button>
          <button type="submit" style={{ background: colors.flashAccentBg, color: colors.flashAccentSoft, border: `1px solid ${colors.flashAccent}`, borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>FOCUS</button>
          {(customTopic || customContext) && (
            <button type="button" onClick={handleClearCustom} style={{ background: "transparent", color: colors.danger, border: `1px solid ${colors.dangerBorder}`, borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>CLEAR</button>
          )}
        </div>
        {showContextInput && (
          <textarea
            value={contextVal}
            onChange={(e) => setContextVal(e.target.value)}
            placeholder="Paste text from a PDF, document, or lecture notes here. The AI will use this as reference material to generate your flashcard..."
            style={{ width: "100%", height: 100, background: colors.panel, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 4, padding: "8px 12px", fontSize: 12, outline: "none", fontFamily: "inherit", resize: "vertical" }}
          />
        )}
      </form>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, padding: "60px 0" }}>
          <div style={{ width: 32, height: 32, border: `2px solid ${colors.border}`, borderTop: `2px solid ${colors.flashAccentBg}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ color: colors.muted2, fontFamily: "monospace", fontSize: 12 }}>Generating card…</span>
        </div>
      )}

      {error && !loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "60px 0" }}>
          <span style={{ color: colors.danger, fontFamily: "monospace", fontSize: 13, textAlign: "center" }}>{error}</span>
          <button onClick={() => loadCard()} style={baseBtn}>RETRY</button>
        </div>
      )}

      {card && !loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, marginTop: 10 }}>
          <div 
            onClick={() => setFlipped(!flipped)}
            style={{
              width: "100%", maxWidth: 500, minHeight: 250, background: flipped ? colors.flashCardBack : colors.panel,
              border: flipped ? `1px solid ${colors.flashAccentBg}` : `1px solid ${colors.border}`, borderRadius: 12, padding: 32,
              display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", cursor: "pointer",
              transition: "all 0.3s ease", position: "relative", boxShadow: flipped ? `0 4px 20px ${colors.flashShadow}` : "none"
            }}
          >
            <div style={{ position: "absolute", top: 12, right: 16, fontSize: 10, fontFamily: "monospace", color: colors.muted }}>
              {flipped ? "BACK" : "FRONT"}
            </div>
            <div style={{ fontSize: flipped ? 15 : 18, color: colors.text, lineHeight: 1.6, fontWeight: flipped ? 400 : 600 }}>
              {flipped ? card.back : card.front}
            </div>
          </div>
          
          <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 500, justifyContent: "center" }}>
            <button onClick={() => setFlipped(!flipped)} style={{ ...baseBtn, flex: 1, borderColor: colors.flashAccentBg, color: colors.flashAccentSoft }}>
              {flipped ? "HIDE ANSWER" : "SHOW ANSWER"}
            </button>
            <button onClick={() => loadCard()} style={{ ...baseBtn, flex: 1, borderColor: colors.accent, color: colors.accent }}>
              NEXT CARD →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────
export default function NurseIQ() {
  const [activeTopic, setActiveTopic] = useState("micropara");
  const [activeTab, setActiveTab] = useState("quiz");
  const [difficulty, setDifficulty] = useState("NCLEX-RN");
  const [theme, setTheme] = useState("classic");
  const [isMobile, setIsMobile] = useState(false);
  const [notes, setNotes] = useState({});
  const [progress, setProgress] = useState({});
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("nurseiq_theme");
    if (savedTheme && THEMES.some((t) => t.id === savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nurseiq_theme", theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const sync = (e) => setIsMobile(e.matches);
    sync(media);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const handleAnswer = (topic, correct) => {
    setProgress((prev) => {
      const cur = prev[topic] || { correct: 0, total: 0, history: [] };
      return { ...prev, [topic]: { correct: cur.correct + (correct ? 1 : 0), total: cur.total + 1, history: [...cur.history, correct] } };
    });
  };

  const handleSaveNote = (topic, text) => {
    setNotes((prev) => ({ ...prev, [topic]: text }));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
  };

  const colors = THEME_COLORS[theme] || THEME_COLORS.classic;

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, color: colors.text, fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", transition: "background .2s ease, color .2s ease" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${colors.panel}; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 2px; }
        button:hover:not(:disabled) { filter: brightness(1.15); }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, padding: isMobile ? "12px 14px" : "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, minWidth: 210 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: colors.accent, letterSpacing: 4 }}>NURSEiq</span>
          <span style={{ fontSize: 10, color: colors.dim, fontFamily: "monospace" }}>AI Study Platform</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: isMobile ? "flex-start" : "flex-end" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: colors.muted, letterSpacing: 1 }}>THEME</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{
                background: colors.panel,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: 4,
                padding: "4px 8px",
                fontSize: 11,
                fontFamily: "monospace",
                outline: "none",
              }}
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          {DIFFICULTY.map((d) => (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              background: difficulty === d ? colors.accent : "transparent",
              color: difficulty === d ? colors.accentText : colors.muted,
              border: difficulty === d ? "none" : `1px solid ${colors.border}`,
              borderRadius: 4, padding: "4px 10px", fontSize: 10,
              cursor: "pointer", fontFamily: "monospace", letterSpacing: 1,
            }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: isMobile ? "100%" : 210, borderRight: isMobile ? "none" : `1px solid ${colors.border}`, borderBottom: isMobile ? `1px solid ${colors.border}` : "none", padding: isMobile ? "10px 8px" : "16px 0", display: "flex", flexDirection: isMobile ? "row" : "column", gap: 2, overflowY: isMobile ? "hidden" : "auto", overflowX: isMobile ? "auto" : "hidden" }}>
          {TOPICS.map((t) => {
            const stats = progress[t.id];
            const pct = stats?.total ? Math.round((stats.correct / stats.total) * 100) : null;
            return (
              <button key={t.id} onClick={() => { setActiveTopic(t.id); setActiveTab("quiz"); }} style={{
                background: activeTopic === t.id ? colors.panelAlt : "transparent",
                borderLeft: activeTopic === t.id ? `2px solid ${colors.accent}` : t.featured ? `2px solid ${colors.infoBorder}` : "2px solid transparent",
                border: "none", color: activeTopic === t.id ? colors.text : t.featured ? colors.infoText : colors.muted,
                padding: isMobile ? "9px 12px" : "10px 16px", textAlign: "left", cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all .15s",
                minWidth: isMobile ? 180 : "auto",
                borderRadius: isMobile ? 6 : 0,
              }}>
                <span>{t.icon} {t.label}</span>
                {pct !== null && (
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: getPerfColor(pct, colors) }}>{pct}%</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${colors.border}`, padding: isMobile ? "0 8px" : "0 24px", overflowX: "auto", whiteSpace: "nowrap" }}>
            {["quiz", "flashcards", "notes", "progress"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background: "none", border: "none",
                borderBottom: activeTab === tab ? `2px solid ${colors.accent}` : "2px solid transparent",
                color: activeTab === tab ? colors.text : colors.muted2, padding: "12px 16px",
                cursor: "pointer", fontFamily: "monospace", fontSize: 11, letterSpacing: 2,
                textTransform: "uppercase", marginBottom: -1, transition: "all .15s",
              }}>
                {tab === "quiz" ? "⚡ Quiz" : tab === "flashcards" ? "🎴 Flashcards" : tab === "notes" ? "📝 Notes" : "📊 Progress"}
              </button>
            ))}
            {savedMsg && <span style={{ marginLeft: "auto", alignSelf: "center", color: colors.accent, fontFamily: "monospace", fontSize: 11 }}>✓ Saved</span>}
          </div>

          {/* Panel */}
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? 14 : 24 }}>
            {activeTab === "quiz" && <QuizPanel key={activeTopic} topic={activeTopic} difficulty={difficulty} progress={progress} onAnswer={handleAnswer} colors={colors} />}
            {activeTab === "flashcards" && <FlashcardPanel key={`fc-${activeTopic}`} topic={activeTopic} difficulty={difficulty} colors={colors} />}
            {activeTab === "notes" && <NotesPanel topic={activeTopic} notes={notes} onSave={handleSaveNote} colors={colors} />}
            {activeTab === "progress" && <ProgressPanel progress={progress} colors={colors} />}
          </div>
        </div>
      </div>
    </div>
  );
}
