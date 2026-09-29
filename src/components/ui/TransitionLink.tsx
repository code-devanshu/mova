"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { usePageTransition } from "@/components/providers/PageTransition";
import { scrollToTarget } from "@/lib/scroll";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * next/link with the shutter transition between routes, and smooth scrolling
 * for links that point at a section of the page you're already on.
 */
export function TransitionLink({ href, onClick, onNavigate, ...props }: Props) {
  const pathname = usePathname();
  const transition = usePageTransition();

  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin || url.pathname !== pathname) return;
        if (url.hash) {
          e.preventDefault();
          scrollToTarget(url.hash);
        } else if (url.search === window.location.search) {
          e.preventDefault();
          scrollToTarget(0);
        }
      }}
      onNavigate={(e) => {
        onNavigate?.(e);
        const url = new URL(href, window.location.href);
        if (!transition || url.pathname === pathname) return;
        e.preventDefault();
        transition.navigate(href);
      }}
    />
  );
}
