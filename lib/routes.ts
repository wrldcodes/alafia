import type { Route } from "next";

/** Cast a path for Next.js typed routes (dynamic redirects, in-progress nav hrefs). */
export function asRoute(path: string): Route {
  return path as Route;
}
