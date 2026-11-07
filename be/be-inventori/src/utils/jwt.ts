import jwt from "jsonwebtoken";
import { env } from "./env";

export type Role = "admin" | "technician";
export type TokenPayload = { id: string; role: Role };

// Tipe khusus untuk token aktivasi akun (tidak butuh role dulu, cukup id dan penanda)
export type ActivationPayload = { id: string; type: "activation" };

export const signToken = (p: TokenPayload): string =>
  jwt.sign(p, env.SECRET, { expiresIn: "1h" });

/** Throws when the token is malformed, expired or signed with another secret. */
export function verifyToken(token: string): TokenPayload {
  const d = jwt.verify(token, env.SECRET) as any;
  if (!d?.id || (d.role !== "admin" && d.role !== "technician"))
    throw new Error("invalid p");
  return { id: String(d.id), role: d.role };
}

// === TAMBAHAN BARU UNTUK FITUR AKTIVASI EMAIL ===

export const generateActivationToken = (p: ActivationPayload): string =>
  jwt.sign(p, env.SECRET, { expiresIn: "24h" }); // Aktif selama 24 jam

export function verifyActivationToken(token: string): ActivationPayload {
  const d = jwt.verify(token, env.SECRET) as any;
  if (!d?.id || d.type !== "activation")
    throw new Error("invalid activation token");
  return { id: String(d.id), type: "activation" };
}
