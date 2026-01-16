import { NextRequest, NextResponse } from "next/server";

const RESERVED = new Set(["admin", "api", "www"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  const hostname = host.split(":")[0];

  if (hostname === "sebelasindonesia.app") {
    return NextResponse.next();
  }

  if (hostname.endsWith(".sebelasindonesia.app")) {
    const subdomain = hostname.replace(".sebelasindonesia.app", "");
    if (subdomain && !RESERVED.has(subdomain)) {
      url.pathname = `/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
