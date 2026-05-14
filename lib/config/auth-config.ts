export interface RoleConfig {
  label: string;
  defaultPath: string;
  fallbackToLogout?: boolean;
}

/**
 * Single source of truth for all roles in this project.
 * Add/rename roles here — nothing else needs to change.
 *
 * defaultPath  — where to send this role when they hit a page they can't access
 * fallbackToLogout — if true, user is logged out instead of redirected
 */
export const ROLE_CONFIG: Record<string, RoleConfig> = {
  admin: { label: 'Admin', defaultPath: '/dashboard' },
  user:  { label: 'User',  defaultPath: '/dashboard/' },
};

export type AppRole = keyof typeof ROLE_CONFIG;

export const isKnownRole = (role: unknown): role is AppRole =>
  typeof role === 'string' && role in ROLE_CONFIG;
