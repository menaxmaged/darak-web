import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Building2,
  Briefcase,
  BadgeCheck,
  BookOpen,
  BookMarked,
  Heart,
  Video,
  Award,
  Bell,
  BarChart3,
  ShieldCheck,
  Settings,
  Users,
} from 'lucide-react';
import { USER_ROLES } from '@/lib/constants';

export const DASHBOARD_NAV_ICONS = {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Building2,
  Briefcase,
  BadgeCheck,
  BookOpen,
  BookMarked,
  Heart,
  Video,
  Award,
  Bell,
  BarChart3,
  ShieldCheck,
  Settings,
  Users,
  // legacy
  Home: LayoutDashboard,
  Mail: Bell,
  MailOpen: Bell,
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
    name: 'Eyoot Dashboard',
    logo: '/logo.png',
    themeColor: '#FFAF00',
  },
  navigation: [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      resource: 'dashboard',
      rolesAllowed: [USER_ROLES.ADMIN, USER_ROLES.USER],
      sidebar: true,
      page: {
        title: 'Dashboard Overview',
        description: 'Operational overview of the Eyoot platform',
      },
    },
    {
      label: 'Students',
      path: '/dashboard/students',
      icon: 'GraduationCap',
      resource: 'students',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Student Management',
        description: 'Manage all students and their internship applications',
      },
    },
    {
      label: 'Applications',
      path: '/dashboard/applications',
      icon: 'FileText',
      resource: 'applications',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Applications',
        description: 'Review and manage all internship applications',
      },
    },
    {
      label: 'Companies',
      path: '/dashboard/companies',
      icon: 'Building2',
      resource: 'companies',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Companies',
        description: 'Manage partner companies and their requirements',
        action: {
          label: 'Add Company',
          href: '/dashboard/companies/new',
        },
      },
    },
    {
      label: 'Positions',
      path: '/dashboard/positions',
      icon: 'Briefcase',
      resource: 'positions',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Positions',
        description: 'Manage internship positions and capacities',
        action: {
          label: 'Add Position',
          href: '/dashboard/positions/new',
        },
      },
    },
    {
      label: 'IBM Proof Reviews',
      path: '/dashboard/ibm-proofs',
      icon: 'BadgeCheck',
      resource: 'ibm-proofs',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'IBM Proof Reviews',
        description: 'Review uploaded IBM course completion proofs',
      },
    },
    {
      label: 'Workshops',
      path: '/dashboard/workshops',
      icon: 'BookOpen',
      resource: 'workshops',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Workshops',
        description: 'Manage workshops and track registrations',
        action: {
          label: 'Add Workshop',
          href: '/dashboard/workshops/new',
        },
      },
    },
    {
      label: 'Courses',
      path: '/dashboard/courses',
      icon: 'BookMarked',
      resource: 'courses',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Courses',
        description: 'Manage course listings and track engagement',
        action: {
          label: 'Add Course',
          href: '/dashboard/courses/new',
        },
      },
    },
    {
      label: 'Volunteering',
      path: '/dashboard/volunteering',
      icon: 'Heart',
      resource: 'volunteering',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Volunteering',
        description: 'Manage volunteering opportunities',
        action: {
          label: 'Add Opportunity',
          href: '/dashboard/volunteering/new',
        },
      },
    },
    {
      label: 'Reels',
      path: '/dashboard/reels',
      icon: 'Video',
      resource: 'reels',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Reels',
        description: 'Manage short-form educational content',
        action: {
          label: 'Upload Reel',
          href: '/dashboard/reels/new',
        },
      },
    },
    {
      label: 'Certificates',
      path: '/dashboard/certificates',
      icon: 'Award',
      resource: 'certificates',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Certificates',
        description: 'Manage and upload internship completion certificates',
      },
    },
    {
      label: 'Notifications',
      path: '/dashboard/notifications',
      icon: 'Bell',
      resource: 'notifications',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Notifications',
        description: 'Send targeted notifications to students',
      },
    },
    {
      label: 'Analytics',
      path: '/dashboard/analytics',
      icon: 'BarChart3',
      resource: 'analytics',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Reports & Analytics',
        description: 'Platform-wide analytics and export tools',
      },
    },
    {
      label: 'Admin Users',
      path: '/dashboard/admins',
      icon: 'ShieldCheck',
      resource: 'admins',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Admin Users',
        description: 'Manage admin accounts and role permissions',
        action: {
          label: 'Add Admin',
          href: '/dashboard/admins/new',
        },
      },
    },
    {
      label: 'Settings',
      path: '/dashboard/settings',
      icon: 'Settings',
      resource: 'settings',
      rolesAllowed: [USER_ROLES.ADMIN],
      sidebar: true,
      page: {
        title: 'Settings',
        description: 'Platform configuration and rules',
      },
    },
  ] satisfies DashboardNavItem[],
} as const;

const normalizePath = (path: string) =>
  path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

const parseConfigPath = (path: string) => {
  const [pathname, queryString] = path.split('?');
  return {
    pathname: normalizePath(pathname),
    query: new URLSearchParams(queryString ?? ''),
  };
};

const matchQueryParams = (required: URLSearchParams, current: URLSearchParams) => {
  for (const [key, value] of required.entries()) {
    if (current.get(key) !== value) return false;
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

  if (
    normalizedPath === itemPathname ||
    normalizedPath.startsWith(`${itemPathname}/`)
  ) {
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

  if (matches.length === 0) return null;

  return matches.sort((a, b) => {
    const aP = parseConfigPath(a.path);
    const bP = parseConfigPath(b.path);
    const aScore = aP.pathname.length + aP.query.toString().length;
    const bScore = bP.pathname.length + bP.query.toString().length;
    return bScore - aScore;
  })[0];
};
