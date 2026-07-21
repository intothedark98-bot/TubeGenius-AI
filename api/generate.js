export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic, category, audience, language } = req.body;

    const prompt = `
You are TubeGenius AI.

Generate ONLY valid JSON in this format:

{
  "title": "",
  "description": "",
  "tags": "",
  "thumbnail_prompt": ""
}

Video Topic: ${topic}
Category: ${category}
Target Audience: ${audience}
Language: ${language}

Requirements:
- Create a viral YouTube title.
- Write an SEO-friendly description.
- Generate comma-separated YouTube tags.
- Create a detailed thumbnail prompt describing a modern, eye-catching YouTube thumbnail.
- Return ONLY JSON.
`;

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.8,
        }),
      }
    );

    const groqData = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(500).json(groqData);
    }

    const ai = JSON.parse(groqData.choices[0].message.content);

    const imageUrl =
      "https://image.pollinations.ai/prompt/" +
      encodeURIComponent(ai.thumbnail_prompt);

    return res.status(200).json({
      title: ai.title,
      description: ai.description,
      tags: ai.tags,
      thumbnail: imageUrl,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
