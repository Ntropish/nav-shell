import type { ComponentType } from "react";

export interface NavItem {
  icon: ComponentType<{ size?: number }>;
  label: string;
  href: string;
  adminOnly?: boolean;
  badge?: number;
  position?: "end";
  className?: string;
}

export interface NavGroup {
  icon: ComponentType<{ size?: number }>;
  label: string;
  adminOnly?: boolean;
  children: { label: string; href: string }[];
  className?: string;
}

// Either render an anchor (`href` set) or a button (`onClick` set). Exactly one of the two
// must be provided — exposing both is ambiguous, exposing neither is a dead entry.
export interface UserMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface NavShellProps {
  items: (NavItem | NavGroup)[];
  user: { name: string; avatarUrl?: string };
  userMenuItems?: UserMenuItem[];
  isAdmin?: boolean;
  onLogout: () => void;
  authDashboardUrl?: string;
  portraitPosition?: "top" | "bottom";
}
