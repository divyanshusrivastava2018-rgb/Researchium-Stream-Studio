import { Router } from 'express';
import { pingDb } from '../db/pool.js';
import { asyncHandler } from '../middleware/async-handler.js';

export const healthRouter = Router();

healthRouter.get(
  '/health',
  asyncHandler(async (_req, res) => {
    let db = false;
    try {
      db = await pingDb();
    } catch {
      db = false;
    }
    res.status(db ? 200 : 503).json({ ok: true, db });
  })
);
