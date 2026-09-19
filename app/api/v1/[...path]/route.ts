import { cookies } from "next/headers";

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4010";

async function proxy(req: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const token = (await cookies()).get("non_session")?.value;
  const incoming = new URL(req.url);
  const url = `${API}/v1/${path.join("/")}${incoming.search}`;
  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const init: RequestInit = { method: req.method, headers };
  if (req.method !== "GET" && req.method !== "HEAD") init.body = await req.text();
  const res = await fetch(url, init);
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}

export const GET = proxy;
export const POST = proxy;
