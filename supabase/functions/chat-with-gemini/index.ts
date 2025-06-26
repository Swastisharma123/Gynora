// supabase/functions/chat-with-gemini/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const { message, context = "", history = [] } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response("Missing GEMINI_API_KEY", { status: 500 });
    }

    // Merge context + history + message
    const chatParts = [
      ...history.map((h: any) => ({
        role: h.role,
        parts: [{ text: h.content }]
      })),
      {
        role: "user",
        parts: [{ text: `${context}\n\nUser: ${message}` }]
      }
    ];

    const payload = {
      contents: chatParts,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const geminiData = await geminiRes.json();

    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn’t understand that.";

    return new Response(JSON.stringify({ response: text }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error("Gemini Error:", e);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500
    });
  }
});
