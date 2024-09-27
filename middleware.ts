import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";

  const [subdomain] = hostname.split(".");

  if (subdomain && subdomain !== "localhost") {
    const url = req.nextUrl.clone();
    url.pathname = `/user/${subdomain}`;

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/", 
};
