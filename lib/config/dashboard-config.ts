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
  Mail,
  MailOpen,
} from 'lucide-react';

/** Maps icon name strings (used in route.json) to Lucide components. */
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
  Mail,
  MailOpen,
  // legacy aliases
  Home: LayoutDashboard,
} as const;

export const DASHBOARD_CONFIG = {
  brand: {
    name: 'Eyoot Dashboard',
    logo: '/logo.png',
    themeColor: '#FFAF00',
  },
} as const;
