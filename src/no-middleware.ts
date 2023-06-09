import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/"],
};

export function middleware(req: NextRequest) {
  if (process.env.BASIC_AUTH_IS_ENABLED !== "1") {
    return NextResponse.next();
  }

  const authorizationHeader = req.headers.get("authorization");
  const url = req.nextUrl;

  if (authorizationHeader) {
    const authValue = authorizationHeader.split(" ")[1];
    const [user, password] = atob(authValue).split(":");

    if (
      user === process.env.BASIC_AUTH_USERNAME &&
      password === process.env.BASIC_AUTH_PASSWORD
    ) {
      return NextResponse.next();
    }
  }

  return new Response("Auth Required.", {
    status: 401,
    headers: {
      "WWW-authenticate": 'Basic realm="Secure Area"',
    },
  });
}
