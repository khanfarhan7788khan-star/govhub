import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const SESSION_COOKIE = "govhub_sid";

/** Reads the visitor session id from cookies. Does NOT create one —
 *  the cookie is guaranteed to already exist because it's set by an
 *  inline script in the root layout before any client fetch runs.
 *  Falls back to creating one server-side for safety (e.g. direct API calls). */
export async function getSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(SESSION_COOKIE)?.value;
  if (existing) return existing;
  return randomUUID();
}
