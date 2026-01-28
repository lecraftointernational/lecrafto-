import { Link as RouterLink, type LinkProps, useInRouterContext } from "react-router-dom";
import type { ComponentPropsWithoutRef } from "react";

// Safe Link wrapper that avoids runtime errors when router context is missing
export const Link = (props: LinkProps & ComponentPropsWithoutRef<"a">) => {
  const inRouter = useInRouterContext();

  if (!inRouter) {
    const { to, replace: _replace, state: _state, relative: _relative, preventScrollReset: _psr, reloadDocument: _rd, ...rest } = props as any;
    const href = typeof to === "string" ? to : "#";
    return <a href={href} {...rest} />;
  }

  return <RouterLink {...props} />;
};
