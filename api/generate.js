export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic, category, audience, language } = req.body;

    const prompt = `
You are TubeGenius AI.

Return ONLY valid JSON.

{
  "title": "",
  "description": "",
  "tags": ""
}

Topic: ${topic}
Category: ${category}
Audience: ${audience}
Language: ${language}

Generate:
- One viral YouTube title
- One SEO description
- 15 comma-separated tags

Return ONLY JSON.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        })
      }
    );

    const groq = await response.json();

    if (!response.ok) {
      return res.status(500).json(groq);
    }

    const content = groq.choices[0].message.content;

    const ai = JSON.parse(content);

    return res.status(200).json(ai);

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
