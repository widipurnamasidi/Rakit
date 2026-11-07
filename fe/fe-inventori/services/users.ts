import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { makeCrud } from "@/lib/crud";
import type { Values } from "@/components/ResourceForm";

export type AppUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "technician";
  isActive: boolean;
  isFormer?: boolean; // <-- Tambahan untuk field data dari backend
};

export type UserInput = {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "technician";
  isActive: boolean;
  isFormer?: boolean; // <-- Tambahan untuk input form
};

export const usersAdmin = makeCrud<AppUser, UserInput>("/users");

export function userPayload(v: Values): UserInput {
  const p: UserInput = {
    name: String(v.name ?? ""),
    email: String(v.email ?? ""),
    role: v.role === "admin" ? "admin" : "technician",
    isActive: v.isActive === undefined ? true : Boolean(v.isActive),
    isFormer: v.isFormer === undefined ? false : Boolean(v.isFormer), // <-- Tangkap nilai isFormer dari form
  };
  const password = String(v.password ?? "");
  if (password) p.password = password;
  return p;
}

export async function listTechnicians(): Promise<AppUser[]> {
  const res = await apiFetch<AppUser[]>("/users", {
    token: getToken(),
    query: { role: "technician", limit: 100 },
  });
  // Pastikan daftar teknisi yang bisa meminjam alat hanya yang masih aktif dan bukan mantan (former)
  return res.data.filter((u) => u.isActive && !u.isFormer);
}
