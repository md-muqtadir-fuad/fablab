import { NextRequest, NextResponse } from "next/server";

const equipmentIds = new Set(["eq-fdm-1", "eq-laser-1", "eq-cnc-1", "eq-sla-1", "eq-robot-1", "eq-pcb-1"]);
const projectIds = new Set(["proj-1", "proj-2", "proj-3"]);

export function middleware(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  // Staff pages: send visitors without a session straight to sign-in.
  // (The pages themselves still check the account's role.)
  if (parts[0] === "admin" && !request.cookies.has("fablab_session")) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  const invalidEquipment = parts[0] === "equipment" && parts.length > 1 && !equipmentIds.has(parts[1]);
  const invalidProject = parts[0] === "projects" && parts.length > 1 && !["start"].includes(parts[1]) && !projectIds.has(parts[1]);
  if (invalidEquipment || invalidProject) {
    return NextResponse.rewrite(new URL("/missing", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/equipment/:path*", "/projects/:path*", "/admin/:path*"] };
