import { defineMiddleware } from "astro:middleware";

import { jwtVerify } from "jose";

const protectedPathRegex = /^\/account($|\/.*)/;
const publicPathRegex = /^\/(?:shop\/product|shop|checkout|cart|)($|\/.*)/;
const authPathRegex = /^\/account\/(login|register)$/;

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  const jwt = context?.cookies?.get("_medusa_jwt")?.value;

  const secret = new TextEncoder().encode(import.meta.env.PUBLIC_JWT_SECRET);

  if (publicPathRegex.test(context?.url?.pathname)) {
    return next();
  }

  if (authPathRegex.test(context?.url?.pathname)) {
    if (jwt) {
      try {
        const verified = await jwtVerify(jwt as unknown as string, secret);

        return context.redirect("/");
      } catch {
        context.cookies.delete("_medusa_jwt");
        return context.redirect("/login");
      }
    }

    return next();
  }

  if (protectedPathRegex?.test(context?.url?.pathname)) {
    if (jwt) {
      try {
        const verified = await jwtVerify(jwt as unknown as string, secret);
        return next();
      } catch {
        context.cookies.delete("_medusa_jwt");
        return context.redirect("/account/login");
      }
    } else {
      return context.redirect("/account/login");
    }
  }

  return next();
});
