const express = require('express');
const router = express.Router();
const { aiLimiter } = require('../middleware/rateLimit');

const PORTFOLIO_CONTEXT = `You are Mohit's AI clone. You are a CS student, competitive programmer, and full-stack developer.
Key facts:
- Name: Mohit
- Role: CS Student & Competitive Programmer & Full Stack Developer
- Skills: Python, C++, Rust, Go, JavaScript, TypeScript, Java, React, Node.js, PostgreSQL, AWS
- Codeforces: Specialist (Rating ~1456), LeetCode: 1847 solved, CodeChef: 4 Star
- Projects: RustDB (custom database engine), NeuralNet from scratch, PortfolioOS (this site), AI Chess Engine, Distributed Task Queue
- Experience: Google SWE Intern (Core Search Infrastructure), Nexus Technologies (Backend Dev)
- Personality: passionate about systems programming, algorithms, and building cool things
Respond in first person as Mohit. Keep answers concise and developer-friendly.`;

// POST /api/ai/chat - AI Persona Chatbot
router.post('/chat', aiLimiter, async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required.' });

  try {
    const response = await callGemini([
      { role: 'user', parts: [{ text: PORTFOLIO_CONTEXT + '\n\nUser: ' + message }] }
    ]);
    
    // Save to DB
    const Chat = require('../models/Chat');
    await Chat.insertMany([
      { sessionId, role: 'user', content: message },
      { sessionId, role: 'assistant', content: response }
    ]);

    res.json({ response });
  } catch (err) {
    res.status(500).json({ error: 'AI service error', detail: err.message });
  }
});

// POST /api/ai/review - Code Review
router.post('/review', aiLimiter, async (req, res) => {
  const { code, language } = req.body;
  if (!code) return res.status(400).json({ error: 'Code required.' });

  const prompt = `Review this ${language || 'code'} for: bugs, improvements, time complexity, code quality score (1-10). Format as JSON with fields: bugs[], improvements[], complexity, score, explanation.

Code:
\`\`\`${language || ''}
${code.slice(0, 3000)}
\`\`\``;

  try {
    const raw = await callGemini([{ role: 'user', parts: [{ text: prompt }] }]);
    // Try to parse JSON, fallback to raw text
    let parsed;
    try { parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}'); }
    catch { parsed = { explanation: raw, score: '?', bugs: [], improvements: [], complexity: 'Unknown' }; }
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'AI review error', detail: err.message });
  }
});

// POST /api/ai/project-idea - Project Idea Generator
router.post('/project-idea', aiLimiter, async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic required.' });

  const prompt = `Generate a detailed project idea for: "${topic}". Return JSON: { name, description, features: [], techStack: [], difficulty: "Easy|Medium|Hard", estimatedTime, learningOutcomes: [] }`;
  
  try {
    const raw = await callGemini([{ role: 'user', parts: [{ text: prompt }] }]);
    let parsed;
    try { parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}'); }
    catch { parsed = { description: raw, name: 'Custom Project', features: [], techStack: [], difficulty: 'Medium', estimatedTime: '2-4 weeks', learningOutcomes: [] }; }
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'AI error', detail: err.message });
  }
});

// POST /api/ai/resume-analyze - Resume vs Job Description Analyzer
router.post('/resume-analyze', aiLimiter, async (req, res) => {
  const { jobDescription } = req.body;
  if (!jobDescription) return res.status(400).json({ error: 'Job description required.' });

  const resumeData = `Name: Mohit | Skills: C++, Python, Rust, Go, JS, TS, React, Node.js, AWS | GPA: 3.9 | Experience: Google SWE Intern, Backend Dev at startup | Projects: Custom DB engine, Neural net from scratch, real-time WebSocket server | CF: Specialist, LeetCode: Top 1%`;
  
  const prompt = `Match this resume against the job description. Return JSON: { matchPercentage, missingSkills: [], highlightProjects: [], coverLetterOpener, summary }.
Resume: ${resumeData}
Job: ${jobDescription.slice(0, 2000)}`;

  try {
    const raw = await callGemini([{ role: 'user', parts: [{ text: prompt }] }]);
    let parsed;
    try { parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}'); }
    catch { parsed = { matchPercentage: '?', summary: raw, missingSkills: [], highlightProjects: [], coverLetterOpener: '' }; }
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'AI error', detail: err.message });
  }
});

// POST /api/ai/wallpaper - HuggingFace Image Generation
router.post('/wallpaper', aiLimiter, async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required.' });

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: `${prompt}, digital art, 4k, cinematic, dark atmospheric` })
    });
    
    if (!response.ok) return res.status(502).json({ error: 'HuggingFace API error', status: response.status });
    
    const buffer = await response.arrayBuffer();
    res.set('Content-Type', 'image/jpeg');
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: 'Wallpaper generation failed', detail: err.message });
  }
});

// ─── Shared Gemini Helper ──────────────────────────────────────────────────────
async function callGemini(contents) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });
  
  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
}

module.exports = router;
