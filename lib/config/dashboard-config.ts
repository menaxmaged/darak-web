import {
  Home,
  Users,
  Mail,
  MailOpen,
} from 'lucide-react';
import { USER_ROLES } from '@/lib/constants';

export const DASHBOARD_NAV_ICONS = {
  Home,
  Users,
  Mail,
  MailOpen,
};

export type DashboardRole = typeof USER_ROLES.ADMIN | typeof USER_ROLES.USER;

export type DashboardNavItem = {
  label: string;
  path: string;
  icon: keyof typeof DASHBOARD_NAV_ICONS;
  resource: string;
  rolesAllowed: DashboardRole[];
  sidebar?: boolean;
  page?: {
    title: string;
    description?: string;
    action?: {
      label: string;
      href: string;
    };
  };
};

export const DASHBOARD_CONFIG = {
  brand: {
    name: 'eyoot Dashboard',
    logo: '/logo.png',
    themeColor: '#FFAF00',
  },
  navigation: [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'Home',
      resource: 'dashboard',
      rolesAllowed: [USER_ROLES.ADMIN, USER_ROLES.USER],
      sidebar: true,
      page: {
        title: 'Dashboard Overview',
        description: 'Welcome back to eyoot admin dashboard',
      },
    },
    {
      label: 'Users',
      path: '/dashboard/users',
      icon: 'Users',
      resource: 'users',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'User Management',
        description: 'Manage and monitor all registered users',
        action: {
          label: 'Create User',
          href: '/dashboard/users/add',
        },
      },
    },
    {
      label: 'Registered Users',
      path: '/dashboard/users?registered=true',
      icon: 'Users',
      resource: 'users:registered',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Registered Users',
        description: 'Users who have paid the registration fee',
      },
    },
    {
      label: 'Inquiries',
      path: '/dashboard/inquiries',
      icon: 'Mail',
      resource: 'inquiries',
      rolesAllowed: [USER_ROLES.ADMIN, USER_ROLES.USER],
      sidebar: true,
      page: {
        title: 'Contact Inquiries',
        description: 'Manage and respond to customer inquiries',
      },
    },
    {
      label: 'Newsletter',
      path: '/dashboard/newsletter',
      icon: 'MailOpen',
      resource: 'newsletter',
      rolesAllowed: [USER_ROLES.ADMIN, USER_ROLES.USER],
      sidebar: true,
      page: {
        title: 'Newsletter Subscribers',
        description: 'Manage your newsletter subscribers',
      },
    },
    {
      label: 'Add User',
      path: '/dashboard/users/add',
      icon: 'Users',
      resource: 'users:add',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: false,
      page: {
        title: 'Create User',
        description: 'Add a new user to the platform',
      },
    },
  ] satisfies DashboardNavItem[],
} as const;

const normalizePath = (path: string) => (path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path);

const parseConfigPath = (path: string) => {
  const [pathname, queryString] = path.split('?');
  return {
    pathname: normalizePath(pathname),
    query: new URLSearchParams(queryString ?? ''),
  };
};

const matchQueryParams = (required: URLSearchParams, current: URLSearchParams) => {
  for (const [key, value] of required.entries()) {
    if (current.get(key) !== value) {
      return false;
    }
  }
  return true;
};

export const isDashboardNavItemActive = (
  item: DashboardNavItem,
  pathname: string,
  searchParams: URLSearchParams
) => {
  const normalizedPath = normalizePath(pathname);
  const { pathname: itemPathname, query } = parseConfigPath(item.path);

  if (itemPathname === '/dashboard') {
    return normalizedPath === itemPathname && matchQueryParams(query, searchParams);
  }

  if (normalizedPath === itemPathname || normalizedPath.startsWith(`${itemPathname}/`)) {
    return matchQueryParams(query, searchParams);
  }

  return false;
};

export const getActiveDashboardNavItem = (
  pathname: string,
  searchParams: URLSearchParams
): DashboardNavItem | null => {
  const matches = DASHBOARD_CONFIG.navigation.filter((item) =>
    isDashboardNavItemActive(item, pathname, searchParams)
  );

  if (matches.length === 0) {
    return null;
  }

  return matches.sort((a, b) => {
    const aParts = parseConfigPath(a.path);
    const bParts = parseConfigPath(b.path);
    const aScore = aParts.pathname.length + aParts.query.toString().length;
    const bScore = bParts.pathname.length + bParts.query.toString().length;
    return bScore - aScore;
  })[0];
};
