export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { topic, category, audience, language } = req.body;

    const prompt = `
You are TubeGenius AI, a world-class YouTube SEO expert.

IMPORTANT:
Return ONLY valid JSON.
Do NOT include markdown.
Do NOT include explanation.
Do NOT wrap the JSON inside \`\`\`.

Return exactly this format:

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

1. TITLE
- Highly clickable
- Professional
- Curiosity driven
- Maximum 80 characters

2. DESCRIPTION
- 250-350 words
- SEO optimized
- Natural emojis
- Well formatted
- End with:
👍 Like
💬 Comment
🔔 Subscribe

3. TAGS
Generate exactly 15 hashtags separated by spaces.

Example:
#minecraft #gaming #tips #survival

4. THUMBNAIL_PROMPT
Generate a highly detailed prompt for an AI image.

Requirements:
- Bright vibrant colors
- Modern YouTube thumbnail
- Cinematic lighting
- One main subject
- High contrast
- Realistic
- Eye-catching
- Leave space for bold text
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.8,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const groq = await response.json();

    if (!response.ok) {
      return res.status(500).json(groq);
    }

    let content = groq.choices[0].message.content;

    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return res.status(500).json({
        error: "AI did not return valid JSON.",
        raw: content
      });
    }

    const json = content.substring(start, end + 1);

    let ai;

    try {
      ai = JSON.parse(json);
    } catch (e) {
      return res.status(500).json({
        error: "Failed to parse AI JSON.",
        raw: json
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
