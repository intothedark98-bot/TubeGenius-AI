export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic, category, audience, language } = req.body;

    const prompt = `
You are TubeGenius AI, an expert YouTube SEO strategist.

Return ONLY valid JSON.

{
  "title": "",
  "description": "",
  "tags": "",
  "thumbnail_prompt": ""
}

Topic: ${topic}
Category: ${category}
Audience: ${audience}
Language: ${language}

Requirements:

- Generate one highly clickable, professional YouTube title.
- Write a detailed SEO-friendly description (200-300 words).
- Use emojis naturally in the description.
- Include a call to action asking viewers to Like, Comment and Subscribe.
- - Generate 15 SEO-optimized comma-separated YouTube tags.
- After the tags, leave one blank line and then generate 5 relevant hashtags.
- Generate exactly 15 relevant hashtags.
- Return them space-separated like this:
#hashtag1 #hashtag2 #hashtag3 #hashtag4 ...
- Generate a detailed thumbnail prompt describing:
  • the main subject
  • bright, vibrant colors
  • cinematic lighting
  • realistic style
  • high click-through-rate design
  • space for large thumbnail text

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

const clean = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

try {
  const ai = JSON.parse(clean);

  const thumbnail =
    "https://image.pollinations.ai/prompt/" +
    encodeURIComponent(ai.thumbnail_prompt);

  return res.status(200).json({
    title: ai.title,
    description: ai.description,
    tags: ai.tags,
    thumbnail: thumbnail
  });

} catch (e) {
  return res.status(500).json({
    raw: clean,
    error: e.message
  });
}
    const thumbnail =
  "https://image.pollinations.ai/prompt/" +
  encodeURIComponent(ai.thumbnail_prompt);

    return res.status(200).json({
    title: ai.title,
    description: ai.description,
    tags: ai.tags,
    thumbnail: thumbnail
});
    
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
