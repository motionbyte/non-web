"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionToken } from "@/lib/session";

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4010";

export type AuthState = { error?: string } | undefined;

function safeNext(value: FormDataEntryValue | null) {
  const next = String(value || "/desk");
  if (!next.startsWith("/") || next.startsWith("//")) return "/desk";
  return next;
}

async function setSession(token: string) {
  const store = await cookies();
  store.set("non_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function signUp(prev: AuthState, formData: FormData): Promise<AuthState> {
  const res = await fetch(`${API}/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    }),
  });
  const data = (await res.json()) as { token?: string; error?: string };
  if (!res.ok || !data.token) return { error: data.error || "Could not sign up." };
  await setSession(data.token);
  redirect(safeNext(formData.get("next")));
}

export async function signIn(prev: AuthState, formData: FormData): Promise<AuthState> {
  const res = await fetch(`${API}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    }),
  });
  const data = (await res.json()) as { token?: string; error?: string };
  if (!res.ok || !data.token) return { error: data.error || "Could not sign in." };
  await setSession(data.token);
  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  const token = await sessionToken();
  if (token) {
    await fetch(`${API}/v1/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }
  const store = await cookies();
  store.delete("non_session");
  redirect("/");
}

export async function moderationAct(formData: FormData) {
  const token = await sessionToken();
  const action = String(formData.get("action") || "");
  const slug = String(formData.get("slug") || "");
  const id = String(formData.get("id") || "");
  const res = await fetch(`${API}/v1/moderation/act`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      action,
      slug,
      id,
      revisionId: String(formData.get("revisionId") || ""),
      reason: String(formData.get("reason") || ""),
    }),
  });
  const data = (await res.json()) as { error?: string };
  if (!res.ok) redirect(`/moderation?error=${encodeURIComponent(data.error || "The desk could not act.")}`);
  if (slug && action === "revert") redirect(`/people/${slug}/history`);
  redirect("/moderation");
}

export async function savePage(prev: AuthState, formData: FormData): Promise<AuthState> {
  const token = await sessionToken();
  if (!token) return { error: "Sign in to edit." };
  const res = await fetch(`${API}/v1/edit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      slug: String(formData.get("slug") || ""),
      headline: String(formData.get("headline") || ""),
      dek: String(formData.get("dek") || ""),
      city: String(formData.get("city") || ""),
      country: String(formData.get("country") || ""),
      achievements: String(formData.get("achievements") || ""),
      origin: String(formData.get("origin") || ""),
      building: String(formData.get("building") || ""),
      body: String(formData.get("body") || ""),
      summary: String(formData.get("summary") || ""),
      expectedRevisionId: String(formData.get("expectedRevisionId") || ""),
    }),
  });
  const data = (await res.json()) as { slug?: string; error?: string; code?: string };
  if (res.status === 409 && data.code === "REVISION_CONFLICT") {
    return { error: "Someone else saved first. Open history, then edit from the current page." };
  }
  if (!res.ok || !data.slug) return { error: data.error || "Could not save." };
  redirect(`/people/${data.slug}`);
}

export async function updateProfile(prev: AuthState, formData: FormData): Promise<AuthState> {
  const token = await sessionToken();
  if (!token) return { error: "Sign in." };
  const res = await fetch(`${API}/v1/me`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: String(formData.get("name") || ""),
      bio: String(formData.get("bio") || ""),
      username: String(formData.get("username") || ""),
    }),
  });
  const data = (await res.json()) as { error?: string };
  if (!res.ok) return { error: data.error || "Could not save." };
  redirect("/desk");
}

export async function changePassword(prev: AuthState, formData: FormData): Promise<AuthState> {
  const token = await sessionToken();
  if (!token) return { error: "Sign in." };
  const res = await fetch(`${API}/v1/me/password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      current: String(formData.get("current") || ""),
      next: String(formData.get("next") || ""),
    }),
  });
  const data = (await res.json()) as { error?: string };
  if (!res.ok) return { error: data.error || "Could not change password." };
  return { error: "Password updated." };
}

export async function revokeSessions() {
  const token = await sessionToken();
  if (token) {
    await fetch(`${API}/v1/me/sessions/revoke`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }
  redirect("/settings/security");
}

export async function requestDelete() {
  const token = await sessionToken();
  if (token) {
    await fetch(`${API}/v1/me/delete`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }
  const store = await cookies();
  store.delete("non_session");
  redirect("/");
}
