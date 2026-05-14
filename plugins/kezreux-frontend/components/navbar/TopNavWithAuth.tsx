// @component: TopNavWithAuth
// @category: navbar
// @description: Top nav with logo, links, and right-aligned auth state. Shows avatar dropdown when authenticated, sign-in CTAs otherwise.
// @keywords: navbar, top nav, header, auth, login, user, avatar, dropdown
// @complexity: medium

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavUser {
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface TopNavWithAuthProps {
  brand: ReactNode;
  links: NavLink[];
  user: NavUser | null;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onSignOut?: () => void;
  className?: string;
}

export function TopNavWithAuth({
  brand,
  links,
  user,
  onSignIn,
  onSignUp,
  onSignOut,
  className,
}: TopNavWithAuthProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  return (
    <nav
      aria-label="Primary"
      className={`flex items-center justify-between border-b border-border bg-background px-4 py-3 sm:px-6 sm:py-4 ${className ?? ""}`}
    >
      <div className="flex items-center gap-8">
        <a
          href="/"
          className="text-base font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          {brand}
        </a>

        <ul className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.active ? "page" : undefined}
                className={`text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm ${
                  link.active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {user ? (
        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Open user menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-md"
            >
              <div className="px-3 py-2 text-sm">
                <p className="font-medium">{user.name}</p>
                {user.email && (
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                )}
              </div>
              <div className="h-px bg-border" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onSignOut?.();
                }}
                className="block w-full px-3 py-2 text-left text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSignIn}
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={onSignUp}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Sign up
          </button>
        </div>
      )}
    </nav>
  );
}

export const demos: Record<string, TopNavWithAuthProps> = {
  "signed in": {
    brand: "Acme",
    links: [
      { label: "Dashboard", href: "#dashboard" },
      { label: "Projects", href: "#projects", active: true },
      { label: "Team", href: "#team" },
    ],
    user: { name: "Nicholas", email: "nicholas@example.com" },
    onSignOut: () => {},
  },
  "signed out": {
    brand: "Acme",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Docs", href: "#docs" },
    ],
    user: null,
    onSignIn: () => {},
    onSignUp: () => {},
  },
};
