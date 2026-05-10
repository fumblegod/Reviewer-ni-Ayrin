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
function Sparkline({ data }) {
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
      <polyline points={pts.join(" ")} fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r="2.5" fill="#4ade80" />
    </svg>
  );
}

// ── MicroPara Quick Reference ─────────────────────────────────────
function MicroCheatSheet() {
  const [filter, setFilter] = useState("all");
  const types = ["all", "🧫", "🦠", "🍄", "🪱"];
  const typeLabels = { all: "All", "🧫": "Bacteria", "🦠": "Viruses", "🍄": "Fungi", "🪱": "Parasites" };
  const filtered = filter === "all" ? MICRO_QUICK_REF : MICRO_QUICK_REF.filter((r) => r.type === filter);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {types.map((t) => (
          <button key={t} onClick={() => setFilter(t)} style={{
            background: filter === t ? "#4ade80" : "#0a0f1a",
            color: filter === t ? "#060b14" : "#64748b",
            border: filter === t ? "none" : "1px solid #1e293b",
            borderRadius: 4, padding: "4px 10px", fontSize: 11,
            cursor: "pointer", fontFamily: "monospace",
          }}>{typeLabels[t]}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((r, i) => (
          <div key={i} style={{ background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 6, padding: "10px 14px" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 14 }}>{r.type}</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "#4ade80", fontWeight: 600 }}>{r.organism}</span>
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{r.key}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Notes Panel ───────────────────────────────────────────────────
function NotesPanel({ topic, notes, onSave }) {
  const [text, setText] = useState(notes[topic] || "");
  useEffect(() => setText(notes[topic] || ""), [topic, notes]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "calc(100vh - 180px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b", letterSpacing: 2, textTransform: "uppercase" }}>
          Notes — {TOPICS.find((t) => t.id === topic)?.label}
        </span>
        <button onClick={() => onSave(topic, text)} style={{
          background: "#0f172a", color: "#4ade80", border: "1px solid #4ade80",
          borderRadius: 4, padding: "3px 10px", fontSize: 11, cursor: "pointer", fontFamily: "monospace",
        }}>SAVE</button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Type your ${TOPICS.find((t) => t.id === topic)?.label} notes here…\n\nTry: key medications, lab values, mnemonics, priority rules…`}
        style={{
          flex: 1, background: "#0a0f1a", color: "#e2e8f0", border: "1px solid #1e293b",
          borderRadius: 6, padding: 12, fontFamily: "monospace", fontSize: 13,
          lineHeight: 1.7, resize: "none", outline: "none",
        }}
      />
    </div>
  );
}

// ── Progress Panel ────────────────────────────────────────────────
function ProgressPanel({ progress }) {
  const topics = TOPICS.map((t) => {
    const data = progress[t.id] || { correct: 0, total: 0, history: [] };
    const pct = data.total ? Math.round((data.correct / data.total) * 100) : null;
    return { ...t, ...data, pct };
  });
  const overall = topics.reduce((a, t) => ({ c: a.c + t.correct, t: a.t + t.total }), { c: 0, t: 0 });
  const overallPct = overall.t ? Math.round((overall.c / overall.t) * 100) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b", letterSpacing: 2, marginBottom: 8 }}>OVERALL PERFORMANCE</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 40, fontWeight: 700, color: overallPct >= 75 ? "#4ade80" : overallPct >= 60 ? "#facc15" : "#f87171", fontFamily: "monospace" }}>
            {overallPct !== null ? `${overallPct}%` : "—"}
          </span>
          <span style={{ color: "#64748b", fontSize: 13 }}>{overall.c}/{overall.t} correct</span>
        </div>
        {overall.t > 0 && (
          <div style={{ marginTop: 8, height: 4, background: "#1e293b", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${overallPct}%`, background: overallPct >= 75 ? "#4ade80" : overallPct >= 60 ? "#facc15" : "#f87171", borderRadius: 2, transition: "width .4s" }} />
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {topics.map((t) => (
          <div key={t.id} style={{ background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 16 }}>{t.icon}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{t.label}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: t.pct >= 75 ? "#4ade80" : t.pct >= 60 ? "#facc15" : t.pct !== null ? "#f87171" : "#334155" }}>
                  {t.pct !== null ? `${t.pct}%` : "—"}
                </div>
                <div style={{ fontSize: 10, color: "#475569" }}>{t.correct}/{t.total}</div>
              </div>
            </div>
            {t.history.length > 1 && (
              <div style={{ marginTop: 6 }}>
                <Sparkline data={t.history.map((h) => (h ? 1 : 0)).map((_, i, arr) => arr.slice(0, i + 1).filter(Boolean).length)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Quiz Panel ────────────────────────────────────────────────────
const btnStyle = {
  background: "#0f172a", color: "#4ade80", border: "1px solid #4ade80",
  borderRadius: 6, padding: "10px 20px", fontSize: 12, cursor: "pointer",
  fontFamily: "monospace", letterSpacing: 2, transition: "all .15s",
};

function QuizPanel({ topic, difficulty, progress, onAnswer }) {
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

  const optionColor = (idx) => {
    if (!revealed) return selected === idx ? "#1e3a5f" : "#0a0f1a";
    if (idx === question.correct) return "#052e16";
    if (idx === selected && selected !== question.correct) return "#2d0a0a";
    return "#0a0f1a";
  };
  const optionBorder = (idx) => {
    if (!revealed) return selected === idx ? "1px solid #3b82f6" : "1px solid #1e293b";
    if (idx === question.correct) return "1px solid #4ade80";
    if (idx === selected && selected !== question.correct) return "1px solid #f87171";
    return "1px solid #1e293b";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stat bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b", letterSpacing: 2, textTransform: "uppercase" }}>
          {TOPICS.find((t) => t.id === topic)?.icon} {TOPICS.find((t) => t.id === topic)?.label}
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {isMicro && (
            <button onClick={() => setShowCheatSheet(!showCheatSheet)} style={{
              background: showCheatSheet ? "#4ade80" : "transparent",
              color: showCheatSheet ? "#060b14" : "#4ade80",
              border: "1px solid #4ade80", borderRadius: 4,
              padding: "3px 10px", fontSize: 10, cursor: "pointer", fontFamily: "monospace",
            }}>
              {showCheatSheet ? "← BACK TO QUIZ" : "📋 QUICK REF"}
            </button>
          )}
          <span style={{ fontFamily: "monospace", fontSize: 12, color: pct >= 75 ? "#4ade80" : pct >= 60 ? "#facc15" : pct !== null ? "#f87171" : "#475569" }}>
            {pct !== null ? `${pct}% (${stats.correct}/${stats.total})` : "No attempts yet"}
          </span>
        </div>
      </div>

      {/* MicroPara subtopic filter */}
      {isMicro && !showCheatSheet && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {MICROPARA_SUBTOPICS.map((s) => (
            <button key={s.id} onClick={() => setSubtopic(s.id)} style={{
              background: subtopic === s.id ? "#1e3a5f" : "#0a0f1a",
              color: subtopic === s.id ? "#93c5fd" : "#475569",
              border: subtopic === s.id ? "1px solid #3b82f6" : "1px solid #1e293b",
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
              style={{ flex: 1, background: "#0a0f1a", color: "#e2e8f0", border: "1px solid #1e293b", borderRadius: 4, padding: "6px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }}
            />
            <button type="button" onClick={() => setShowContextInput(!showContextInput)} style={{ background: showContextInput ? "#1e3a5f" : "#0a0f1a", color: "#93c5fd", border: "1px solid #3b82f6", borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>+ DOCUMENT</button>
            <button type="submit" style={{ background: "#1e3a5f", color: "#93c5fd", border: "1px solid #3b82f6", borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>FOCUS</button>
            {(customTopic || customContext) && (
              <button type="button" onClick={handleClearCustom} style={{ background: "transparent", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>CLEAR</button>
            )}
          </div>
          {showContextInput && (
            <textarea
              value={contextVal}
              onChange={(e) => setContextVal(e.target.value)}
              placeholder="Paste text from a PDF, document, or lecture notes here. The AI will use this as reference material to generate your question..."
              style={{ width: "100%", height: 100, background: "#0a0f1a", color: "#e2e8f0", border: "1px solid #1e293b", borderRadius: 4, padding: "8px 12px", fontSize: 12, outline: "none", fontFamily: "inherit", resize: "vertical" }}
            />
          )}
        </form>
      )}

      {/* Cheat sheet */}
      {isMicro && showCheatSheet && <MicroCheatSheet />}

      {/* Quiz content */}
      {!showCheatSheet && loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, padding: "60px 0" }}>
          <div style={{ width: 32, height: 32, border: "2px solid #1e293b", borderTop: "2px solid #4ade80", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ color: "#475569", fontFamily: "monospace", fontSize: 12 }}>Generating question…</span>
        </div>
      )}

      {!showCheatSheet && error && !loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "60px 0" }}>
          <span style={{ color: "#f87171", fontFamily: "monospace", fontSize: 13, textAlign: "center" }}>{error}</span>
          <button onClick={() => loadQuestion()} style={btnStyle}>RETRY</button>
        </div>
      )}

      {!showCheatSheet && question && !loading && !error && (
        <>
          <div style={{ background: "#0a0f1a", border: "1px solid #1e293b", borderRadius: 8, padding: 16, lineHeight: 1.7, color: "#e2e8f0", fontSize: 14 }}>
            {question.question}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {question.options.map((opt, idx) => (
              <button key={idx} onClick={() => !revealed && setSelected(idx)} style={{
                background: optionColor(idx), border: optionBorder(idx),
                borderRadius: 6, padding: "10px 14px", color: "#e2e8f0", fontSize: 13,
                textAlign: "left", cursor: revealed ? "default" : "pointer",
                transition: "all .15s", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b", minWidth: 16 }}>
                  {revealed ? (idx === question.correct ? "✓" : idx === selected && selected !== question.correct ? "✗" : " ") : String.fromCharCode(65 + idx)}
                </span>
                {opt.replace(/^[A-D]\.\s*/, "")}
              </button>
            ))}
          </div>

          {!revealed ? (
            <button onClick={() => { if (selected !== null) { setRevealed(true); onAnswer(topic, selected === question.correct); } }}
              disabled={selected === null} style={{ ...btnStyle, opacity: selected === null ? 0.4 : 1 }}>
              CHECK ANSWER
            </button>
          ) : (
            <>
              <div style={{
                background: selected === question.correct ? "#052e16" : "#2d0a0a",
                border: `1px solid ${selected === question.correct ? "#4ade80" : "#f87171"}`,
                borderRadius: 8, padding: 14, fontSize: 13, lineHeight: 1.7, color: "#e2e8f0",
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 2, color: selected === question.correct ? "#4ade80" : "#f87171", marginBottom: 6 }}>
                  {selected === question.correct ? "✓ CORRECT" : "✗ INCORRECT"} — RATIONALE
                </div>
                {question.rationale}
              </div>
              <button onClick={() => loadQuestion()} style={btnStyle}>NEXT QUESTION →</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ── Flashcard Panel ────────────────────────────────────────────────
function FlashcardPanel({ topic, difficulty }) {
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
        <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b", letterSpacing: 2, textTransform: "uppercase" }}>
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
            style={{ flex: 1, background: "#0a0f1a", color: "#e2e8f0", border: "1px solid #1e293b", borderRadius: 4, padding: "6px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }}
          />
          <button type="button" onClick={() => setShowContextInput(!showContextInput)} style={{ background: showContextInput ? "#4c1d95" : "#0a0f1a", color: "#ddd6fe", border: "1px solid #8b5cf6", borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>+ DOCUMENT</button>
          <button type="submit" style={{ background: "#7c3aed", color: "#ddd6fe", border: "1px solid #8b5cf6", borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>FOCUS</button>
          {(customTopic || customContext) && (
            <button type="button" onClick={handleClearCustom} style={{ background: "transparent", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 4, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>CLEAR</button>
          )}
        </div>
        {showContextInput && (
          <textarea
            value={contextVal}
            onChange={(e) => setContextVal(e.target.value)}
            placeholder="Paste text from a PDF, document, or lecture notes here. The AI will use this as reference material to generate your flashcard..."
            style={{ width: "100%", height: 100, background: "#0a0f1a", color: "#e2e8f0", border: "1px solid #1e293b", borderRadius: 4, padding: "8px 12px", fontSize: 12, outline: "none", fontFamily: "inherit", resize: "vertical" }}
          />
        )}
      </form>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, padding: "60px 0" }}>
          <div style={{ width: 32, height: 32, border: "2px solid #1e293b", borderTop: "2px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ color: "#475569", fontFamily: "monospace", fontSize: 12 }}>Generating card…</span>
        </div>
      )}

      {error && !loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "60px 0" }}>
          <span style={{ color: "#f87171", fontFamily: "monospace", fontSize: 13, textAlign: "center" }}>{error}</span>
          <button onClick={() => loadCard()} style={btnStyle}>RETRY</button>
        </div>
      )}

      {card && !loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, marginTop: 10 }}>
          <div 
            onClick={() => setFlipped(!flipped)}
            style={{
              width: "100%", maxWidth: 500, minHeight: 250, background: flipped ? "#1e1b4b" : "#0a0f1a",
              border: flipped ? "1px solid #7c3aed" : "1px solid #1e293b", borderRadius: 12, padding: 32,
              display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", cursor: "pointer",
              transition: "all 0.3s ease", position: "relative", boxShadow: flipped ? "0 4px 20px rgba(124, 58, 237, 0.2)" : "none"
            }}
          >
            <div style={{ position: "absolute", top: 12, right: 16, fontSize: 10, fontFamily: "monospace", color: "#64748b" }}>
              {flipped ? "BACK" : "FRONT"}
            </div>
            <div style={{ fontSize: flipped ? 15 : 18, color: "#e2e8f0", lineHeight: 1.6, fontWeight: flipped ? 400 : 600 }}>
              {flipped ? card.back : card.front}
            </div>
          </div>
          
          <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 500, justifyContent: "center" }}>
            <button onClick={() => setFlipped(!flipped)} style={{ ...btnStyle, flex: 1, borderColor: "#7c3aed", color: "#a78bfa" }}>
              {flipped ? "HIDE ANSWER" : "SHOW ANSWER"}
            </button>
            <button onClick={() => loadCard()} style={{ ...btnStyle, flex: 1, borderColor: "#4ade80", color: "#4ade80" }}>
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
  const [notes, setNotes] = useState({});
  const [progress, setProgress] = useState({});
  const [savedMsg, setSavedMsg] = useState(false);

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

  return (
    <div style={{ minHeight: "100vh", background: "#060b14", color: "#e2e8f0", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0f1a; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        button:hover:not(:disabled) { filter: brightness(1.15); }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#4ade80", letterSpacing: 4 }}>NURSEiq</span>
          <span style={{ fontSize: 10, color: "#334155", fontFamily: "monospace" }}>AI Study Platform</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {DIFFICULTY.map((d) => (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              background: difficulty === d ? "#4ade80" : "transparent",
              color: difficulty === d ? "#060b14" : "#64748b",
              border: difficulty === d ? "none" : "1px solid #1e293b",
              borderRadius: 4, padding: "4px 10px", fontSize: 10,
              cursor: "pointer", fontFamily: "monospace", letterSpacing: 1,
            }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 210, borderRight: "1px solid #1e293b", padding: "16px 0", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {TOPICS.map((t) => {
            const stats = progress[t.id];
            const pct = stats?.total ? Math.round((stats.correct / stats.total) * 100) : null;
            return (
              <button key={t.id} onClick={() => { setActiveTopic(t.id); setActiveTab("quiz"); }} style={{
                background: activeTopic === t.id ? "#0f172a" : "transparent",
                borderLeft: activeTopic === t.id ? "2px solid #4ade80" : t.featured ? "2px solid #3b82f6" : "2px solid transparent",
                border: "none", color: activeTopic === t.id ? "#e2e8f0" : t.featured ? "#93c5fd" : "#64748b",
                padding: "10px 16px", textAlign: "left", cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all .15s",
              }}>
                <span>{t.icon} {t.label}</span>
                {pct !== null && (
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: pct >= 75 ? "#4ade80" : pct >= 60 ? "#facc15" : "#f87171" }}>{pct}%</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #1e293b", padding: "0 24px" }}>
            {["quiz", "flashcards", "notes", "progress"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background: "none", border: "none",
                borderBottom: activeTab === tab ? "2px solid #4ade80" : "2px solid transparent",
                color: activeTab === tab ? "#e2e8f0" : "#475569", padding: "12px 16px",
                cursor: "pointer", fontFamily: "monospace", fontSize: 11, letterSpacing: 2,
                textTransform: "uppercase", marginBottom: -1, transition: "all .15s",
              }}>
                {tab === "quiz" ? "⚡ Quiz" : tab === "flashcards" ? "🎴 Flashcards" : tab === "notes" ? "📝 Notes" : "📊 Progress"}
              </button>
            ))}
            {savedMsg && <span style={{ marginLeft: "auto", alignSelf: "center", color: "#4ade80", fontFamily: "monospace", fontSize: 11 }}>✓ Saved</span>}
          </div>

          {/* Panel */}
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {activeTab === "quiz" && <QuizPanel key={activeTopic} topic={activeTopic} difficulty={difficulty} progress={progress} onAnswer={handleAnswer} />}
            {activeTab === "flashcards" && <FlashcardPanel key={`fc-${activeTopic}`} topic={activeTopic} difficulty={difficulty} />}
            {activeTab === "notes" && <NotesPanel topic={activeTopic} notes={notes} onSave={handleSaveNote} />}
            {activeTab === "progress" && <ProgressPanel progress={progress} />}
          </div>
        </div>
      </div>
    </div>
  );
}
