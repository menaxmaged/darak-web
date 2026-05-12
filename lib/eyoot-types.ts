// ─── Application Status ───────────────────────────────────────────────────────
export type ApplicationStatus =
  | 'applied'
  | 'ibm-course-required'
  | 'interview'
  | 'declined'
  | 'approved'
  | 'volunteering-required'
  | 'certificate-ready';

export type IBMProofStatus =
  | 'not-uploaded'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'reupload-requested';

export type InterviewStatus = 'pending' | 'scheduled' | 'completed' | 'no-show';
export type VolunteeringStatus = 'not-required' | 'pending' | 'completed';
export type CertificateStatus = 'not-ready' | 'ready' | 'uploaded';

// ─── Student ─────────────────────────────────────────────────────────────────
export interface Student {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dialCode?: string;
  dateOfBirth?: string;
  nationalId?: string;
  nationalIdFront?: string;
  nationalIdBack?: string;
  age?: number;
  gender?: 'male' | 'female';
  profileImage?: string;
  signupDate: string;
  lastActive?: string;
  studentType: 'signed-up' | 'applied';
  applicationsCount: number;
  ibmBadgesCount: number;
  certificatesCount: number;
  status: 'active' | 'inactive';
  isBanned: boolean;
}

export interface StudentForm {
  university?: string;
  faculty?: string;
  major?: string;
  academicYear?: string;
  gpa?: number;
  skills?: string[];
  languages?: string[];
  experience?: string;
  projects?: string;
  activities?: string;
  certifications?: string;
  links?: string[];
  portfolio?: string;
  linkedin?: string;
  github?: string;
  behance?: string;
  availability?: string;
  volunteeringHistory?: string;
}

export interface StudentDetail extends Student {
  form?: StudentForm;
  applications?: Application[];
}

// ─── Application ─────────────────────────────────────────────────────────────
export interface Application {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentUsername?: string;
  companyId: number;
  companyName: string;
  companyLogo?: string;
  positionId: number;
  positionTitle: string;
  status: ApplicationStatus;
  ibmProofStatus: IBMProofStatus;
  interviewStatus?: InterviewStatus;
  volunteeringStatus: VolunteeringStatus;
  certificateStatus: CertificateStatus;
  capacityWarning?: boolean;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
  formSnapshot?: StudentForm;
}

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  date: string;
  adminName?: string;
  note?: string;
}

export interface InterviewSlot {
  id: number;
  date: string;
  time: string;
  location?: string;
  link?: string;
  deadline?: string;
  allowRescheduling: boolean;
  rescheduleDeadline?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
}

export interface ApplicationDetail extends Application {
  ibmProof?: IBMProof;
  interviewSlot?: InterviewSlot;
  certificate?: Certificate;
  internalNotes?: string[];
  statusHistory?: StatusHistoryEntry[];
}

// ─── Company ─────────────────────────────────────────────────────────────────
export interface CompanyRequirement {
  minAge?: number;
  minGpa?: number;
  languageRequirements?: string[];
  minAcademicYear?: string;
  ibmRequired?: boolean;
  volunteeringRequired?: boolean;
  otherRequirements?: string[];
}

export interface Company {
  id: number;
  name: string;
  logo?: string;
  industry: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  activePositions: number;
  totalCapacity: number;
  usedCapacity: number;
  remainingCapacity: number;
  applicationsCount: number;
  requirements?: CompanyRequirement;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface CompanyDetail extends Company {
  positions?: Position[];
}

// ─── Position ─────────────────────────────────────────────────────────────────
export interface Position {
  id: number;
  companyId: number;
  companyName: string;
  companyLogo?: string;
  title: string;
  description?: string;
  requirements?: string[];
  capacity: number;
  usedCapacity: number;
  remainingCapacity: number;
  deadline?: string;
  applicantsCount: number;
  approvedCount: number;
  pendingCount: number;
  status: 'active' | 'inactive' | 'full';
  createdAt: string;
}

// ─── IBM Proof ────────────────────────────────────────────────────────────────
export interface IBMProof {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail?: string;
  applicationId: number;
  companyName: string;
  positionTitle: string;
  courseTitle: string;
  courseUrl?: string;
  proofUrl: string;
  proofType: 'image' | 'pdf';
  status: IBMProofStatus;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// ─── Workshop ─────────────────────────────────────────────────────────────────
export interface Workshop {
  id: number;
  title: string;
  image?: string;
  speaker?: string;
  date: string;
  time?: string;
  capacity?: number;
  isUnlimited: boolean;
  location?: string;
  type: 'physical' | 'online' | 'video' | 'external';
  registrationLink?: string;
  videoLink?: string;
  category?: string;
  views: number;
  clicks: number;
  registrations: number;
  status: 'draft' | 'published' | 'completed';
  createdAt: string;
}

// ─── Course ───────────────────────────────────────────────────────────────────
export interface Course {
  id: number;
  title: string;
  image?: string;
  description?: string;
  type: 'external' | 'internal-video' | 'informational';
  provider?: string;
  link?: string;
  category?: string;
  views: number;
  clicks: number;
  saves: number;
  registrations: number;
  status: 'draft' | 'published';
  createdAt: string;
}

// ─── Volunteering ─────────────────────────────────────────────────────────────
export interface VolunteeringOpportunity {
  id: number;
  title: string;
  organization: string;
  description?: string;
  location?: string;
  date?: string;
  requiredHours: number;
  capacity?: number;
  isUnlimited: boolean;
  skillsNeeded?: string[];
  applicantsCount: number;
  approvedCount: number;
  completedCount: number;
  status: 'active' | 'closed' | 'completed';
  createdAt: string;
}

// ─── Reel ─────────────────────────────────────────────────────────────────────
export interface Reel {
  id: number;
  title: string;
  thumbnailUrl?: string;
  videoUrl: string;
  category?: string;
  linkedOpportunityId?: number;
  linkedOpportunityType?: 'position' | 'workshop' | 'course';
  views: number;
  likes: number;
  saves: number;
  shares: number;
  publishedAt: string;
  status: 'draft' | 'published';
}

// ─── Certificate ──────────────────────────────────────────────────────────────
export interface Certificate {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail?: string;
  applicationId: number;
  companyName: string;
  positionTitle: string;
  title: string;
  fileUrl: string;
  completionDate: string;
  uploadedAt: string;
  isNotified: boolean;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export type NotificationTarget =
  | 'all'
  | 'signed-up-only'
  | 'internship-applicants'
  | 'by-company'
  | 'by-position'
  | 'by-status'
  | 'missing-ibm-proof'
  | 'missing-interview';

export interface Notification {
  id: number;
  title: string;
  body: string;
  type: 'in-app' | 'email' | 'push';
  target: NotificationTarget;
  targetDetails?: {
    companyId?: number;
    positionId?: number;
    status?: ApplicationStatus;
  };
  recipientCount?: number;
  sentAt?: string;
  createdBy?: string;
  status: 'draft' | 'sent' | 'scheduled';
  scheduledAt?: string;
}

// ─── Analytics / Dashboard ────────────────────────────────────────────────────
export interface DashboardStats {
  totalStudents: number;
  signedUpStudents: number;
  appliedStudents: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  declinedApplications: number;
  ibmProofsPending: number;
  activeCompanies: number;
  activePositions: number;
  capacityFilledPercent: number;
  volunteeringApplications: number;
  certificatesUploaded: number;
  workshopRegistrations: number;
  courseViews: number;
  reelEngagement: number;
}

export interface QuickAlert {
  id: string;
  type: 'warning' | 'info' | 'error' | 'success';
  message: string;
  href?: string;
}

// ─── Admin User ───────────────────────────────────────────────────────────────
export type AdminRole =
  | 'super-admin'
  | 'applications-manager'
  | 'student-manager'
  | 'content-manager'
  | 'analytics-viewer';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  status: 'active' | 'inactive';
  lastActive?: string;
  createdAt: string;
}

// ─── Shared ───────────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
