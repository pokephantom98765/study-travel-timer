import 'dotenv/config';
import express from 'express';
import path from 'path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const isProd = process.argv.includes('--production') || process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '200kb' }));

app.post('/api/session-feedback', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    res.status(503).json({ feedback: null });
    return;
  }

  const { subject, duration, notes, distractions } = req.body as {
    subject?: unknown;
    duration?: unknown;
    notes?: unknown;
    distractions?: unknown;
  };

  const safeSubject = typeof subject === 'string' ? subject.slice(0, 120) : 'General study';
  const safeDuration = Number.isFinite(Number(duration)) ? Math.max(0, Math.round(Number(duration) / 60000)) : 0;
  const safeNotes = typeof notes === 'string' ? notes.slice(0, 1000) : '';
  const safeDistractions = Number.isFinite(Number(distractions)) ? Math.max(0, Math.round(Number(distractions))) : 0;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      You are the "Cabin Crew" of a StudyTravel Flight.
      The passenger just finished a focus session.
      Subject: ${safeSubject}
      Duration: ${safeDuration} minutes
      Distractions (Strict Mode): ${safeDistractions}
      Session Notes: ${safeNotes}

      Provide short, encouraging, themed feedback in under 3 sentences.
      Include one practical suggestion for the next session.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ feedback: response.text || null });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ feedback: null });
  }
});

async function start() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: rootDir,
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const indexPath = path.resolve(rootDir, 'index.html');
        const template = await readFile(indexPath, 'utf-8');
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  } else {
    const distPath = path.resolve(rootDir, 'dist');
    app.use(express.static(distPath));
    app.use('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`StudyTravel server running on http://localhost:${port}`);
  });
}

start();
