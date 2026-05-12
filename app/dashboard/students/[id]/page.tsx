'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, GraduationCap, Mail, Phone, Calendar, CreditCard,
  FileText, BadgeCheck, Award, ChevronDown, ChevronUp,
  Building2, Briefcase, Clock, CheckCircle2, XCircle,
  AlertTriangle, Upload, Eye, Pencil, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useStudent } from '@/Modules/students/students';
import { useUpdateApplicationStatus } from '@/Modules/applications/applications';
import {
  APPLICATION_STATUS_CONFIG, IBM_PROOF_STATUS_CONFIG, formatDate, formatDateTime,
  capacityColor,
} from '@/lib/status-helpers';
import { Application, ApplicationStatus } from '@/lib/eyoot-types';

// ─── Section header ───────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
      {children}
    </h3>
  );
}

// ─── Info field ───────────────────────────────────────────────────────────────
function InfoRow({ label, value, icon: Icon }: { label: string; value?: string | number | null; icon?: React.ElementType }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-border/50 last:border-0">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{value ?? '—'}</p>
      </div>
    </div>
  );
}

// ─── Status timeline ──────────────────────────────────────────────────────────
const STATUS_ORDER: ApplicationStatus[] = [
  'applied', 'ibm-course-required', 'interview', 'approved',
  'volunteering-required', 'certificate-ready',
];

function StatusTimeline({ current }: { current: ApplicationStatus }) {
  const isDeclined = current === 'declined';
  const activeIdx = STATUS_ORDER.indexOf(current);

  return (
    <div className="space-y-1">
      {isDeclined ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span className="text-sm text-red-700 font-medium">Application Declined</span>
        </div>
      ) : (
        <div className="flex items-start gap-0 overflow-x-auto pb-1">
          {STATUS_ORDER.map((s, idx) => {
            const cfg = APPLICATION_STATUS_CONFIG[s];
            const done = idx < activeIdx;
            const active = idx === activeIdx;
            return (
              <div key={s} className="flex flex-col items-center min-w-0">
                <div className="flex items-center w-full">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold z-10
                      ${done ? 'bg-emerald-500' : active ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  >
                    {done ? '✓' : idx + 1}
                  </div>
                  {idx < STATUS_ORDER.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-0.5 ${done ? 'bg-emerald-500' : 'bg-muted-foreground/20'}`} />
                  )}
                </div>
                <span className={`text-[10px] mt-1 text-center leading-tight max-w-16 truncate
                  ${active ? 'text-primary font-semibold' : done ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Application card ─────────────────────────────────────────────────────────
function ApplicationCard({ app }: { app: Application }) {
  const [expanded, setExpanded] = useState(false);
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus();

  const statusCfg = APPLICATION_STATUS_CONFIG[app.status];
  const ibmCfg = IBM_PROOF_STATUS_CONFIG[app.ibmProofStatus];

  const ALL_STATUSES: ApplicationStatus[] = [
    'applied', 'ibm-course-required', 'interview', 'approved',
    'volunteering-required', 'certificate-ready', 'declined',
  ];

  const capacityPct = app.capacityWarning ? 100 : 0;

  return (
    <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm text-foreground">{app.companyName}</p>
            <span className="text-muted-foreground text-xs">·</span>
            <p className="text-sm text-muted-foreground">{app.positionTitle}</p>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
            <Badge variant={ibmCfg.variant}>{ibmCfg.label}</Badge>
            {app.capacityWarning && (
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" /> Capacity Full
              </Badge>
            )}
          </div>
        </div>
        <div className="text-xs text-muted-foreground shrink-0 text-right hidden sm:block">
          <p>Applied {formatDate(app.appliedAt)}</p>
          <p className="mt-0.5">Updated {formatDate(app.updatedAt)}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-4 bg-muted/10">
          {/* Timeline */}
          <div>
            <SectionTitle>Status Progress</SectionTitle>
            <StatusTimeline current={app.status} />
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-white rounded-xl p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">IBM Proof</p>
              <Badge variant={ibmCfg.variant} className="text-xs">{ibmCfg.label}</Badge>
            </div>
            <div className="bg-white rounded-xl p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Interview</p>
              <Badge variant="gray" className="text-xs">
                {app.interviewStatus ?? 'N/A'}
              </Badge>
            </div>
            <div className="bg-white rounded-xl p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Volunteering</p>
              <Badge variant={app.volunteeringStatus === 'completed' ? 'success' : 'gray'} className="text-xs">
                {app.volunteeringStatus}
              </Badge>
            </div>
            <div className="bg-white rounded-xl p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Certificate</p>
              <Badge variant={app.certificateStatus === 'uploaded' ? 'success' : 'gray'} className="text-xs">
                {app.certificateStatus}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <SectionTitle>Actions</SectionTitle>
          </div>
          <div className="flex flex-wrap gap-2 -mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Update status:</span>
              <Select
                value={app.status}
                onValueChange={(v) =>
                  updateStatus({ id: app.id, status: v as ApplicationStatus })
                }
                disabled={isPending}
              >
                <SelectTrigger className="h-8 text-xs w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {APPLICATION_STATUS_CONFIG[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" asChild>
              <Link href={`/dashboard/applications/${app.id}`}>
                <Eye className="w-3.5 h-3.5" /> Full Detail
              </Link>
            </Button>
            {app.status === 'ibm-course-required' && (
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" asChild>
                <Link href={`/dashboard/ibm-proofs?applicationId=${app.id}`}>
                  <BadgeCheck className="w-3.5 h-3.5" /> View IBM Proof
                </Link>
              </Button>
            )}
            {(app.status === 'approved' || app.status === 'certificate-ready') && (
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                <Upload className="w-3.5 h-3.5" /> Upload Certificate
              </Button>
            )}
          </div>

          {app.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <strong>Note:</strong> {app.notes}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── Tab button ───────────────────────────────────────────────────────────────
function Tab({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors
        ${active ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
    >
      {children}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<'info' | 'form' | 'applications'>('info');

  const { data: student, isLoading } = useStudent(Number(id));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <GraduationCap className="w-16 h-16 text-muted-foreground/30" />
        <p className="text-muted-foreground">Student not found</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const fullName = `${student.firstName} ${student.lastName}`;
  const applications: Application[] = student.applications ?? [];
  const form = student.form;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back + heading */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{fullName}</h1>
            <p className="text-sm text-muted-foreground">@{student.username}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant={student.studentType === 'applied' ? 'info' : 'gray'}>
            {student.studentType === 'applied' ? 'Applied' : 'Signed-Up Only'}
          </Badge>
          <Badge variant={student.isBanned ? 'destructive' : 'success'}>
            {student.isBanned ? 'Banned' : 'Active'}
          </Badge>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Applications', value: student.applicationsCount, icon: FileText },
          { label: 'IBM Badges', value: student.ibmBadgesCount, icon: BadgeCheck },
          { label: 'Certificates', value: student.certificatesCount, icon: Award },
          { label: 'Age', value: student.age ?? '—', icon: Calendar },
        ].map((s) => (
          <Card key={s.label} className="border border-border shadow-sm rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-muted/40 rounded-2xl p-1.5 w-fit">
        <Tab active={tab === 'info'} onClick={() => setTab('info')}>Basic Info</Tab>
        <Tab active={tab === 'form'} onClick={() => setTab('form')}>Student Form</Tab>
        <Tab active={tab === 'applications'} onClick={() => setTab('applications')}>
          Applications ({applications.length})
        </Tab>
      </div>

      {/* Tab: Basic Info */}
      {tab === 'info' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-border shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <InfoRow label="Full Name" value={fullName} icon={GraduationCap} />
              <InfoRow label="Email" value={student.email} icon={Mail} />
              <InfoRow label="Phone" value={student.phone ? `${student.dialCode ?? ''} ${student.phone}` : undefined} icon={Phone} />
              <InfoRow label="Date of Birth" value={formatDate(student.dateOfBirth)} icon={Calendar} />
              <InfoRow label="Age" value={student.age} icon={Calendar} />
              <InfoRow label="Gender" value={student.gender} />
              <InfoRow label="National ID" value={student.nationalId} icon={CreditCard} />
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <InfoRow label="Username" value={student.username} />
              <InfoRow label="Signup Date" value={formatDateTime(student.signupDate)} />
              <InfoRow label="Last Active" value={formatDateTime(student.lastActive)} />
              <InfoRow label="Status" value={student.status} />
              <InfoRow label="Banned" value={student.isBanned ? 'Yes' : 'No'} />
            </CardContent>

            {/* ID Images */}
            {(student.nationalIdFront || student.nationalIdBack) && (
              <CardContent className="pt-0">
                <SectionTitle>ID Images (Records Only)</SectionTitle>
                <div className="flex gap-3">
                  {student.nationalIdFront && (
                    <a
                      href={student.nationalIdFront}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> ID Front
                    </a>
                  )}
                  {student.nationalIdBack && (
                    <a
                      href={student.nationalIdBack}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> ID Back
                    </a>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* Tab: Student Form */}
      {tab === 'form' && (
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Student Form / Profile</CardTitle>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <FileText className="w-3.5 h-3.5" /> Download PDF
            </Button>
          </CardHeader>
          <CardContent>
            {!form ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No form data available — student has not completed their profile.
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-0">
                  <SectionTitle>Academic</SectionTitle>
                  <InfoRow label="University" value={form.university} />
                  <InfoRow label="Faculty / Major" value={form.faculty ?? form.major} />
                  <InfoRow label="Academic Year" value={form.academicYear} />
                  <InfoRow label="GPA" value={form.gpa} />
                </div>
                <div className="space-y-0">
                  <SectionTitle>Profile Links</SectionTitle>
                  <InfoRow label="LinkedIn" value={form.linkedin} />
                  <InfoRow label="GitHub" value={form.github} />
                  <InfoRow label="Behance" value={form.behance} />
                  <InfoRow label="Portfolio" value={form.portfolio} />
                  <InfoRow label="Availability" value={form.availability} />
                </div>
                <div>
                  <SectionTitle>Skills & Languages</SectionTitle>
                  {form.skills && form.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {form.skills.map((s: string) => (
                        <Badge key={s} variant="secondary">{s}</Badge>
                      ))}
                    </div>
                  )}
                  {form.languages && form.languages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {form.languages.map((l: string) => (
                        <Badge key={l} variant="info">{l}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <SectionTitle>Experience & Activities</SectionTitle>
                  {form.experience && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Experience</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{form.experience}</p>
                    </div>
                  )}
                  {form.activities && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Activities</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{form.activities}</p>
                    </div>
                  )}
                  {form.volunteeringHistory && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Volunteering History</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{form.volunteeringHistory}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab: Applications */}
      {tab === 'applications' && (
        <div className="space-y-3">
          {applications.length === 0 ? (
            <Card className="border border-border shadow-sm rounded-2xl">
              <CardContent className="py-16 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground font-medium">No applications yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This student has not applied to any internships.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {applications.length} application{applications.length !== 1 ? 's' : ''} total
                </p>
              </div>
              {applications.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
