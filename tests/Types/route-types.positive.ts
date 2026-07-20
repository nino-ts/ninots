/**
 * Positive type-level checks against the committed RouteRegistry artifact.
 *
 * @packageDocumentation
 */

import type { RouteRegistry } from "@ninots/routing";
import type { Equal, Expect } from "./expect";

type _home = Expect<Equal<RouteRegistry["home"], Record<never, never>>>;
type _show = Expect<Equal<RouteRegistry["users.show"], { id: string }>>;

type HasRequiredParams<Name extends keyof RouteRegistry> = [keyof RouteRegistry[Name]] extends [never] ? false : true;

type _homeOptional = Expect<Equal<HasRequiredParams<"home">, false>>;
type _showRequired = Expect<Equal<HasRequiredParams<"users.show">, true>>;

export type PositiveStarterRouteTypes = [_home, _show, _homeOptional, _showRequired];
