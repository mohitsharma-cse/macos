const router = require('express').Router();
const fetch  = require('node-fetch');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `You are an AI assistant representing Mohit Chauhan's portfolio — NebulaOS.
You are a CS student and full-stack developer from India. You know Python, C++, JavaScript, React, Node.js.
You have built: NebulaOS (browser OS), AI chatbot, full-stack social app, and more.
Be friendly, technical, and enthusiastic. Respond as the portfolio owner in first person. Keep responses concise.`;

/* ── AI Chat ── */
router.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'No message' });

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
        'X-Title': 'NebulaOS AI Chat'
      },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it:free',
        messages,
        max_tokens: 600,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.json({ response: text });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

/* ── AI Code Review ── */
router.post('/review', async (req, res) => {
  const { code, language = 'javascript' } = req.body;
  if (!code) return res.status(400).json({ error: 'No code' });

  const prompt = `Review this ${language} code. Respond ONLY as JSON (no markdown):
{"score":number,"bugs":["..."],"improvements":["..."],"timeComplexity":"O(?)","spaceComplexity":"O(?)"}
Code: ${code}`;

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'google/gemma-3-27b-it:free', messages: [{ role: 'user', content: prompt }], max_tokens: 500, temperature: 0.3 })
    });
    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || '{}';
    text = text.replace(/```json|```/g, '').trim();
    try { res.json(JSON.parse(text)); }
    catch { res.json({ score: 7, bugs: [], improvements: [text], timeComplexity: 'N/A', spaceComplexity: 'N/A' }); }
  } catch (err) { res.status(500).json({ error: 'Review failed' }); }
});

/* ── AI Terminal ── */
router.post('/terminal', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it:free',
        messages: [
          { role: 'system', content: 'You are an AI terminal assistant in NebulaOS. Respond in plain text only, no markdown. Keep responses under 200 words.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300, temperature: 0.7
      })
    });
    const data = await response.json();
    res.json({ response: data.choices?.[0]?.message?.content || '' });
  } catch (err) { res.status(500).json({ error: 'Terminal AI failed' }); }
});

/* ── AI Code Explain ── */
router.post('/explain', async (req, res) => {
  const { code, language = 'javascript' } = req.body;
  if (!code) return res.status(400).json({ error: 'No code' });
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it:free',
        messages: [{ role: 'user', content: `Explain this ${language} code simply for beginners:\n${code}` }],
        max_tokens: 400, temperature: 0.5
      })
    });
    const data = await response.json();
    res.json({ explanation: data.choices?.[0]?.message?.content || '' });
  } catch (err) { res.status(500).json({ error: 'Explain failed' }); }
});

module.exports = router;
