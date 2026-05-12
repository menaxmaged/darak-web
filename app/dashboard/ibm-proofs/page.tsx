'use client';

import { useState } from 'react';
import {
  Search, Filter, BadgeCheck, CheckCircle2, XCircle, RefreshCw,
  ExternalLink, FileText, Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useIBMProofs, useReviewIBMProof } from '@/Modules/ibm-proofs/ibm-proofs';
import { IBM_PROOF_STATUS_CONFIG, formatDateTime } from '@/lib/status-helpers';
import { IBMProof } from '@/lib/eyoot-types';
import Link from 'next/link';

// ─── Review dialog ────────────────────────────────────────────────────────────
function ReviewDialog({
  proof,
  open,
  onClose,
}: {
  proof: IBMProof | null;
  open: boolean;
  onClose: () => void;
}) {
  const [reason, setReason] = useState('');
  const { mutate: review, isPending } = useReviewIBMProof();

  const handle = (status: 'approved' | 'rejected' | 'reupload-requested') => {
    if (!proof) return;
    review({ id: proof.id, status, reason: reason || undefined }, {
      onSuccess: () => { setReason(''); onClose(); },
    });
  };

  if (!proof) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Review IBM Proof</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Student</span>
              <Link href={`/dashboard/students/${proof.studentId}`} className="font-medium text-primary hover:underline">
                {proof.studentName}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Course</span>
              <span className="font-medium">{proof.courseTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Company</span>
              <span className="font-medium">{proof.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Position</span>
              <span className="font-medium">{proof.positionTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uploaded</span>
              <span className="font-medium">{formatDateTime(proof.uploadedAt)}</span>
            </div>
          </div>

          {/* Proof preview */}
          <div className="border border-border rounded-xl overflow-hidden">
            {proof.proofType === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={proof.proofUrl} alt="IBM proof" className="w-full max-h-64 object-contain bg-muted" />
            ) : (
              <a
                href={proof.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
              >
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">View PDF Proof</p>
                  <p className="text-xs text-muted-foreground">Opens in new tab</p>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
              </a>
            )}
          </div>

          {proof.courseUrl && (
            <a
              href={proof.courseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Original Course
            </a>
          )}

          <Textarea
            placeholder="Optional note (required for rejection)…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="resize-none h-20 text-sm"
          />
        </div>
        <DialogFooter className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50"
            onClick={() => handle('reupload-requested')}
            disabled={isPending}
          >
            <RefreshCw className="w-4 h-4" /> Request Reupload
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => handle('rejected')}
            disabled={isPending || !reason}
          >
            <XCircle className="w-4 h-4" /> Reject
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => handle('approved')}
            disabled={isPending}
          >
            <CheckCircle2 className="w-4 h-4" /> Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Proof row ────────────────────────────────────────────────────────────────
function ProofRow({
  proof,
  onReview,
}: {
  proof: IBMProof;
  onReview: (p: IBMProof) => void;
}) {
  const cfg = IBM_PROOF_STATUS_CONFIG[proof.status];

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
      <td className="px-4 py-3">
        <Link href={`/dashboard/students/${proof.studentId}`} className="font-medium text-sm text-primary hover:underline">
          {proof.studentName}
        </Link>
        {proof.studentEmail && (
          <p className="text-xs text-muted-foreground">{proof.studentEmail}</p>
        )}
      </td>
      <td className="px-4 py-3 text-sm">
        <p className="font-medium text-foreground">{proof.companyName}</p>
        <p className="text-xs text-muted-foreground">{proof.positionTitle}</p>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{proof.courseTitle}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDateTime(proof.uploadedAt)}</td>
      <td className="px-4 py-3">
        <Badge variant={cfg.variant}>{cfg.label}</Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <a
            href={proof.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> {proof.proofType === 'pdf' ? 'PDF' : 'Image'}
          </a>
          {proof.status === 'pending' && (
            <Button
              size="sm"
              className="h-7 text-xs px-3 gap-1.5 bg-[#FFAF00] text-white hover:bg-[#e09e00]"
              onClick={() => onReview(proof)}
            >
              <BadgeCheck className="w-3.5 h-3.5" /> Review
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

function RowSkeleton() {
  return (
    <tr>
      {[150, 140, 140, 110, 100, 120].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IBMProofsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [reviewing, setReviewing] = useState<IBMProof | null>(null);

  const params: Record<string, unknown> = {};
  if (statusFilter !== 'all') params.status = statusFilter;
  if (search) params.search = search;

  const { data, isLoading } = useIBMProofs(params);
  const proofs: IBMProof[] = data?.data ?? [];

  const filtered = proofs.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.studentName.toLowerCase().includes(q) ||
      p.companyName.toLowerCase().includes(q) ||
      p.courseTitle.toLowerCase().includes(q)
    );
  });

  const pendingCount = proofs.filter((p) => p.status === 'pending').length;

  return (
    <div className="space-y-5">
      {/* Header alert */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
          <Clock className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            <strong>{pendingCount}</strong> IBM proof{pendingCount !== 1 ? 's' : ''} are waiting for your review.
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search student, company or course…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="reupload-requested">Reupload Requested</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isLoading && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="gray">{filtered.length} total</Badge>
          <Badge variant="warning">{filtered.filter((p) => p.status === 'pending').length} pending</Badge>
          <Badge variant="success">{filtered.filter((p) => p.status === 'approved').length} approved</Badge>
          <Badge variant="destructive">{filtered.filter((p) => p.status === 'rejected').length} rejected</Badge>
        </div>
      )}

      <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Student', 'Company / Position', 'Course', 'Uploaded', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)
                  : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">
                        <BadgeCheck className="w-10 h-10 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No IBM proofs found</p>
                        <p className="text-xs mt-1">
                          {statusFilter === 'pending' ? 'All caught up! No pending reviews.' : 'Try a different filter.'}
                        </p>
                      </td>
                    </tr>
                  )
                  : filtered.map((p) => (
                    <ProofRow key={p.id} proof={p} onReview={setReviewing} />
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ReviewDialog proof={reviewing} open={!!reviewing} onClose={() => setReviewing(null)} />
    </div>
  );
}
