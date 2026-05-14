// @component: UserList
// @category: data
// @description: List of users with avatar (image or initials fallback), name, email, role, and per-row action menu slot. For team/member screens, recipient pickers, etc.
// @keywords: data, user, list, team, members, avatar, contacts
// @complexity: medium

import type { ReactNode } from "react";

export interface UserListItem {
  id: string;
  name: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  /** Slot for an action button (kebab menu, "View", etc.). */
  action?: ReactNode;
}

export interface UserListProps {
  users: UserListItem[];
  onUserClick?: (user: UserListItem) => void;
  /** Title rendered above the list. */
  title?: ReactNode;
  emptyState?: ReactNode;
  className?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserList({
  users,
  onUserClick,
  title,
  emptyState = "No users.",
  className,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <div className={`rounded-md border border-border bg-card p-8 text-center text-sm text-muted-foreground ${className ?? ""}`}>
        {emptyState}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-border bg-card text-card-foreground ${className ?? ""}`}>
      {title && (
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        </div>
      )}
      <ul className="divide-y divide-border">
        {users.map((user) => {
          const interactive = !!onUserClick;
          return (
            <li
              key={user.id}
              onClick={interactive ? () => onUserClick(user) : undefined}
              className={`flex items-center gap-4 px-5 py-3 transition-colors ${interactive ? "cursor-pointer hover:bg-accent/40" : ""}`}
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium text-muted-foreground"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  initials(user.name)
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                  {user.email && user.role && <span> · </span>}
                  {user.role}
                </p>
              </div>
              {user.action && (
                <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                  {user.action}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const demos: Record<string, UserListProps> = {
  default: {
    title: "Team members",
    users: [
      { id: "1", name: "Nicholas Aanefam", email: "nicholas@example.com", role: "Owner" },
      { id: "2", name: "Ada Lovelace",     email: "ada@example.com",      role: "Admin" },
      { id: "3", name: "Alan Turing",      email: "alan@example.com",     role: "Engineer" },
      { id: "4", name: "Grace Hopper",     email: "grace@example.com",    role: "Engineer" },
    ],
  },
};
