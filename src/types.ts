import type { ComponentType } from "react";

export interface NavItem {
  icon: ComponentType<{ size?: number }>;
  label: string;
  href: string;
  adminOnly?: boolean;
}

export interface NavGroup {
  icon: ComponentType<{ size?: number }>;
  label: string;
  adminOnly?: boolean;
  children: { label: string; href: string }[];
}

export interface UserMenuItem {
  label: string;
  href: string;
}

export interface NavShellProps {
  items: (NavItem | NavGroup)[];
  user: { name: string; avatarUrl?: string };
  userMenuItems?: UserMenuItem[];
  currentPath: string;
  isAdmin?: boolean;
  onLogout: () => void;
  authDashboardUrl?: string;
  portraitPosition?: "top" | "bottom";
}
