import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireStaffJWT } from "../middleware/staffAuth.js";
import { requireRole } from "../middleware/roles.js";
import * as M from "../models/staffArcadeModel.js";

const r = Router();
r.use(requireStaffJWT);

const EVENT_KEY = process.env.EVENT_KEY;

// who am i
r.get("/me", (req, res) => {
  res.json({ staff: req.staff });
});

// wallet lookup (both roles)
r.get("/wallets/lookup", asyncHandler(async (req, res) => {
  const code = String(req.query.code || "").trim();
  if (!code) return res.status(400).json({ error: "code required" });

  const item = await M.walletLookupByCode({ eventKey: EVENT_KEY, code });
  if (!item) return res.json({ item: null });

  const recent = await M.walletRecentTxns({ eventKey: EVENT_KEY, walletId: item.wallet_id, limit: 3 });

  // Always fetch team members from arcade_registration_members table
  const teamMembers = await M.getTeamMembers({ 
    eventKey: EVENT_KEY, 
    regId: item.reg_id
  });

  res.json({ item, recent, teamMembers });
}));

/* Gate check-in */
r.post("/checkin/approve", requireRole("GATE"), asyncHandler(async (req, res) => {
  const regId = String(req.body?.reg_id || "").trim();
  if (!regId) return res.status(400).json({ error: "reg_id required" });

  const item = await M.checkinApprove({
    eventKey: EVENT_KEY,
    regId,
    staffId: req.staff.staff_id,
    staffUsername: req.staff.username,
  });

  res.json({ item });
}));

r.post("/checkin/reject", requireRole("GATE"), asyncHandler(async (req, res) => {
  const regId = String(req.body?.reg_id || "").trim();
  if (!regId) return res.status(400).json({ error: "reg_id required" });

  const reason = String(req.body?.reason || "").trim();

  const item = await M.checkinReject({
    eventKey: EVENT_KEY,
    regId,
    staffId: req.staff.staff_id,
    staffUsername: req.staff.username,
    reason,
  });

  res.json({ item });
}));

/* Games + presets (GAME staff) */
r.get("/games", requireRole("GAME"), asyncHandler(async (_req, res) => {
  const items = await M.gamesActiveList({ eventKey: EVENT_KEY });
  res.json({ items });
}));

r.get("/games/:gameId/presets", requireRole("GAME"), asyncHandler(async (req, res) => {
  const gameId = req.params.gameId;
  const items = await M.presetsActiveByGame({ eventKey: EVENT_KEY, gameId });
  res.json({ items });
}));

/* Transactions (GAME staff) */
r.post("/txns/debit", requireRole("GAME"), asyncHandler(async (req, res) => {
  const b = req.body || {};
  const walletId = String(b.wallet_id || "").trim();
  const amount = Number(b.amount);
  const gameId = b.game_id || null;
  const actionId = String(b.action_id || "").trim();
  const reason = String(b.reason || "PLAY").trim();
  const note = b.note ? String(b.note).trim() : null;

  const item = await M.staffTxnApply({
    eventKey: EVENT_KEY,
    walletId,
    type: "DEBIT",
    amount,
    reason,
    note,
    gameId,
    presetId: null,
    actionId,
    staffId: req.staff.staff_id,
    staffUsername: req.staff.username,
    enforceCheckedIn: true,
  });

  res.json({ item });
}));

r.post("/txns/credit", requireRole("GAME"), asyncHandler(async (req, res) => {
  const b = req.body || {};
  const walletId = String(b.wallet_id || "").trim();
  const amount = Number(b.amount);
  const gameId = b.game_id || null;
  const presetId = b.preset_id || null;
  const actionId = String(b.action_id || "").trim();
  const reason = String(b.reason || "REWARD").trim();
  const note = b.note ? String(b.note).trim() : null;

  const item = await M.staffTxnApply({
    eventKey: EVENT_KEY,
    walletId,
    type: "CREDIT",
    amount,
    reason,
    note,
    gameId,
    presetId,
    actionId,
    staffId: req.staff.staff_id,
    staffUsername: req.staff.username,
    enforceCheckedIn: true,
  });

  res.json({ item });
}));

export default r;
