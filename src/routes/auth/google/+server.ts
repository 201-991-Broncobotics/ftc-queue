import { dev } from "$app/environment";
import { google } from "$lib/auth.server";
import { redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { generateState, generateCodeVerifier } from "arctic";

export async function GET(event: RequestEvent) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile"],
  });

  const cookieOptions = {
    secure: !dev,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  };

  event.cookies.set("google_auth_state", state, cookieOptions);
  event.cookies.set("google_auth_code_verifier", codeVerifier, cookieOptions);

  return redirect(307, url);
}
