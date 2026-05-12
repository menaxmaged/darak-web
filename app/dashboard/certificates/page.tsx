'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Award, Download, Bell, ExternalLink, MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCertificates, useResendCertificateNotification } from '@/Modules/certificates/certificates';
import { formatDate } from '@/lib/status-helpers';
import { Certificate } from '@/lib/eyoot-types';

function RowSkeleton() {
  return (
    <tr>
      {[160, 140, 140, 100, 80, 80].map((w, i) => (
        <td key={i} className="px-4 py-3"><Skeleton className="h-4" style={{ width: w }} /></td>
      ))}
    </tr>
  );
}

function CertRow({ cert }: { cert: Certificate }) {
  const { mutate: resend, isPending } = useResendCertificateNotification();

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors group">
      <td className="px-4 py-3">
        <Link href={`/dashboard/students/${cert.studentId}`} className="font-medium text-sm text-primary hover:underline">
          {cert.studentName}
        </Link>
        {cert.studentEmail && <p className="text-xs text-muted-foreground">{cert.studentEmail}</p>}
      </td>
      <td className="px-4 py-3 text-sm">
        <p className="font-medium text-foreground">{cert.companyName}</p>
        <p className="text-xs text-muted-foreground">{cert.positionTitle}</p>
      </td>
      <td className="px-4 py-3 text-sm text-foreground font-medium">{cert.title}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(cert.completionDate)}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(cert.uploadedAt)}</td>
      <td className="px-4 py-3">
        <Badge variant={cert.isNotified ? 'success' : 'warning'}>
          {cert.isNotified ? 'Notified' : 'Not Notified'}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={cert.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Download className="w-3 h-3" /> Download
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" /> Open File
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => resend(cert.id)} disabled={isPending}>
                <Bell className="w-4 h-4 mr-2" /> Resend Notification
              </DropdownMenuItem>
              <DropdownMenuItem>Replace File</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

export default function CertificatesPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useCertificates();
  const certs: Certificate[] = data?.data ?? [];

  const filtered = certs.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.studentName.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search certificates…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {!isLoading && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="gray">{filtered.length} certificates</Badge>
          <Badge variant="success">{filtered.filter((c) => c.isNotified).length} notified</Badge>
          <Badge variant="warning">{filtered.filter((c) => !c.isNotified).length} pending notification</Badge>
        </div>
      )}

      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Student', 'Company / Position', 'Certificate', 'Completion', 'Uploaded', 'Notified', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)
                  : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                        <Award className="w-10 h-10 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No certificates found</p>
                      </td>
                    </tr>
                  )
                  : filtered.map((c) => <CertRow key={c.id} cert={c} />)}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
