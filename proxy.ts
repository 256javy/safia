import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

const middlewareFn = createMiddleware(routing);

export function proxy(request: Request) {
  return middlewareFn(request as Parameters<typeof middlewareFn>[0]);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
