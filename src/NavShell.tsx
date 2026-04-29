import { useState, useEffect, useRef } from "react";
import { CircleUser, LogOut } from "lucide-react";
import type { NavShellProps, NavItem, NavGroup } from "./types";
import "./NavShell.css";

function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
  return "children" in item;
}

export function NavShell({
  items,
  user,
  userMenuItems,
  currentPath,
  isAdmin,
  onLogout,
  authDashboardUrl = "https://auth.trivorn.org",
  portraitPosition = "bottom",
}: NavShellProps) {
  const [openGroupIndex, setOpenGroupIndex] = useState<number | null>(null);
  const [userOpen, setUserOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroupIndex(null);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const visibleItems = items.filter(
    (item) => !item.adminOnly || isAdmin
  );
  const mainItems = visibleItems.filter(
    (item) => !("position" in item && item.position === "end")
  );
  const endItems = visibleItems.filter(
    (item) => "position" in item && item.position === "end"
  );

  function isItemActive(item: NavItem | NavGroup): boolean {
    if (isNavGroup(item)) {
      return item.children.some((child) =>
        currentPath === child.href ||
        currentPath.startsWith(child.href + "/") ||
        currentPath.startsWith(child.href + "?")
      );
    }
    return currentPath === item.href;
  }

  return (
    <nav className="navshell" ref={navRef} data-portrait-position={portraitPosition}>
      <a
        href={authDashboardUrl}
        className="navshell-logo"
        title="Home"
      >
        T
      </a>

      <div className="navshell-nav">
        {mainItems.map((item, i) => {
          if (isNavGroup(item)) {
            const active = isItemActive(item);
            const isOpen = openGroupIndex === i;
            return (
              <div key={item.label} style={{ position: "relative" }}>
                <button
                  className={`navshell-icon-btn${active ? " active" : ""}`}
                  title={item.label}
                  onClick={() =>
                    setOpenGroupIndex(isOpen ? null : i)
                  }
                >
                  <item.icon size={24} />
                </button>
                {isOpen && (
                  <div className="navshell-flyout">
                    {item.children.map((child) => (
                      <a key={child.href} href={child.href}>
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const active = isItemActive(item);
          return (
            <a
              key={item.href}
              href={item.href}
              className={`navshell-icon-btn${active ? " active" : ""}`}
              title={item.label}
            >
              <item.icon size={24} />
              {item.badge != null && item.badge > 0 && (
                <span className="navshell-badge">{item.badge > 99 ? "99+" : item.badge}</span>
              )}
            </a>
          );
        })}
      </div>

      {endItems.length > 0 && (
        <div className="navshell-nav-end">
          {endItems.map((item) => {
            if (isNavGroup(item)) {
              const active = isItemActive(item);
              const endIdx = visibleItems.indexOf(item);
              const isOpen = openGroupIndex === endIdx;
              return (
                <div key={item.label} style={{ position: "relative" }}>
                  <button
                    className={`navshell-icon-btn${active ? " active" : ""}`}
                    title={item.label}
                    onClick={() => setOpenGroupIndex(isOpen ? null : endIdx)}
                  >
                    <item.icon size={24} />
                  </button>
                  {isOpen && (
                    <div className="navshell-flyout">
                      {item.children.map((child) => (
                        <a key={child.href} href={child.href}>
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const active = isItemActive(item);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`navshell-icon-btn${active ? " active" : ""}`}
                title={item.label}
              >
                <item.icon size={24} />
                {item.badge != null && item.badge > 0 && (
                  <span className="navshell-badge">{item.badge > 99 ? "99+" : item.badge}</span>
                )}
              </a>
            );
          })}
        </div>
      )}

      <div ref={userRef} className="navshell-user-section">
        <button
          className="navshell-icon-btn"
          title={user.name}
          onClick={() => setUserOpen(!userOpen)}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="navshell-user-avatar"
            />
          ) : (
            <CircleUser size={24} />
          )}
        </button>
        {userOpen && (
          <div className="navshell-user-dropdown">
            <div className="navshell-user-dropdown-name">{user.name}</div>
            {userMenuItems?.map((menuItem) =>
              menuItem.onClick ? (
                <button
                  key={menuItem.label}
                  type="button"
                  className="navshell-user-dropdown-link"
                  onClick={() => {
                    setUserOpen(false);
                    menuItem.onClick!();
                  }}
                >
                  {menuItem.label}
                </button>
              ) : (
                <a
                  key={menuItem.href ?? menuItem.label}
                  href={menuItem.href}
                  className="navshell-user-dropdown-link"
                >
                  {menuItem.label}
                </a>
              )
            )}
            <button
              className="navshell-user-dropdown-logout"
              onClick={() => {
                setUserOpen(false);
                onLogout();
              }}
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export function NavShellLayout(
  props: NavShellProps & { children: React.ReactNode }
) {
  const { children, ...navProps } = props;
  const portraitPosition = navProps.portraitPosition ?? "bottom";
  return (
    <div className="navshell-layout">
      <NavShell {...navProps} />
      <div className="navshell-content" data-portrait-position={portraitPosition}>{children}</div>
    </div>
  );
}
