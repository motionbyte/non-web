import { cache } from "react";
import { cookies } from "next/headers";
import type { Lane, RecordItem } from "@/lib/api";

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4010";

export type Role = "member" | "contributor" | "trusted_contributor" | "reviewer" | "moderator" | "desk";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  username?: string;
  role: Role;
  bio?: string;
  permissions?: string[];
};

export type Me = {
  user: SessionUser;
  record: RecordItem | null;
  unread?: number;
};

export function isMod(user?: SessionUser | null) {
  return user?.role === "moderator" || user?.role === "desk";
}

export function can(user: SessionUser | null | undefined, permission: string) {
  if (!user) return false;
  if (user.permissions?.includes(permission)) return true;
  return isMod(user) && ["REVIEW_EDITS", "REVERT_EDIT", "PROTECT_PAGE"].includes(permission);
}

export async function sessionToken() {
  return (await cookies()).get("non_session")?.value || "";
}

export async function authHeaders(): Promise<HeadersInit> {
  const token = await sessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getMe = cache(async function getMe(): Promise<Me | null> {
  const token = await sessionToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API}/v1/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Me;
    if (data.record) data.record.lane = (data.record.lane || "filed") as Lane;
    return data;
  } catch {
    return null;
  }
});

export async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: await authHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
