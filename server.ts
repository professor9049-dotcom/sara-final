import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface StatusCheck {
  id: string;
  client_name: string;
  timestamp: string;
}

interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  company: string | null;
  message: string;
  created_at: string;
}

// In-memory persistent collections across request lifecycle
const statusChecks: StatusCheck[] = [];
const contactMessages: ContactMessage[] = [];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(cors({
    origin: '*',
    credentials: true,
  }));
  app.use(express.json());

  // API router
  const apiRouter = express.Router();

  apiRouter.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Sara Official API' });
  });

  apiRouter.post('/status', (req: Request, res: Response) => {
    const { client_name } = req.body || {};
    if (!client_name || typeof client_name !== 'string') {
      res.status(422).json({ detail: 'client_name is required' });
      return;
    }
    const check: StatusCheck = {
      id: crypto.randomUUID(),
      client_name,
      timestamp: new Date().toISOString(),
    };
    statusChecks.push(check);
    res.json(check);
  });

  apiRouter.get('/status', (_req: Request, res: Response) => {
    res.json(statusChecks);
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  apiRouter.post('/contact', (req: Request, res: Response) => {
    const { full_name, email, phone, country, company, message } = req.body || {};

    if (!full_name || typeof full_name !== 'string' || full_name.trim().length === 0) {
      res.status(422).json({ detail: 'Full name is required' });
      return;
    }

    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      res.status(422).json({ detail: 'A valid email address is required' });
      return;
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(422).json({ detail: 'Message is required' });
      return;
    }

    const contact: ContactMessage = {
      id: crypto.randomUUID(),
      full_name: full_name.trim(),
      email: email.trim(),
      phone: phone ? String(phone).trim() : null,
      country: country ? String(country).trim() : null,
      company: company ? String(company).trim() : null,
      message: message.trim(),
      created_at: new Date().toISOString(),
    };

    contactMessages.unshift(contact);
    res.status(201).json(contact);
  });

  apiRouter.get('/contact', (_req: Request, res: Response) => {
    res.json(contactMessages);
  });

  app.use('/api', apiRouter);

  // Development: Vite middleware
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
