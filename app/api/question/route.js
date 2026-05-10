export async function POST(request) {
  const { prompt } = await request.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "paste_your_key_here") {
    return Response.json(
      { error: "Groq API key not configured. Add it to .env.local" },
      { status: 500 }
    );
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return Response.json({ error: `Groq API error: ${err}` }, { status: 500 });
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";

  const clean = text.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(clean);
    return Response.json(parsed);
  } catch {
    return Response.json({ error: "Failed to parse AI response", raw: clean }, { status: 500 });
  }
}

