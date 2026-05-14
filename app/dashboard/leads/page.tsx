'use client';

import { useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useLeads } from '@/Modules/leads/hooks';
import { TablePagination } from '@/components/ui/table-pagination';
import type { ContactType } from '@/Modules/leads/types';

const PAGE_SIZE = 20;

const CONTACT_ICONS: Record<ContactType, React.ReactNode> = {
  call: <Phone className="h-3.5 w-3.5" />,
  whatsapp: <MessageCircle className="h-3.5 w-3.5" />,
};

const CONTACT_COLORS: Record<ContactType, string> = {
  call: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  whatsapp: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function LeadsPage() {
  const [typeFilter, setTypeFilter] = useState<ContactType | 'all'>('all');
  const [page, setPage] = useState(1);

  const setType = (v: ContactType | 'all') => { setTypeFilter(v); setPage(1); };

  const { data: leadsRes, isLoading } = useLeads(
    typeFilter !== 'all'
      ? { contactType: typeFilter, page, limit: PAGE_SIZE }
      : { page, limit: PAGE_SIZE }
  );
  const leads = leadsRes?.data ?? [];
  const meta = leadsRes?.meta;

  const callCount = leads.filter((l) => l.contact_type === 'call').length;
  const waCount = leads.filter((l) => l.contact_type === 'whatsapp').length;

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Leads', value: isLoading ? '…' : (meta?.totalItems ?? leads.length) },
          { label: 'Calls', value: isLoading ? '…' : callCount },
          { label: 'WhatsApp', value: isLoading ? '…' : waCount },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-bold font-display">{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {isLoading ? '…' : (meta?.totalItems ?? leads.length)} lead{(meta?.totalItems ?? leads.length) !== 1 ? 's' : ''}
        </p>
        <Select value={typeFilter} onValueChange={(v) => setType(v as ContactType | 'all')}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="call">Call</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : leads.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Type</th>
                  <th className="text-left p-4 text-sm font-medium">Listing ID</th>
                  <th className="text-left p-4 text-sm font-medium hidden md:table-cell">Advertiser ID</th>
                  <th className="text-left p-4 text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${CONTACT_COLORS[lead.contact_type]}`}>
                        {CONTACT_ICONS[lead.contact_type]}
                        {lead.contact_type === 'whatsapp' ? 'WhatsApp' : 'Call'}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-mono text-muted-foreground">
                      {lead.listing_id}
                    </td>
                    <td className="p-4 text-sm font-mono text-muted-foreground hidden md:table-cell">
                      {lead.advertiser_id}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(lead.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-secondary/40 rounded-xl">
          <p className="text-muted-foreground">No {typeFilter !== 'all' ? typeFilter : ''} leads found.</p>
        </div>
      )}
      <TablePagination meta={meta} page={page} onPageChange={setPage} />
    </>
  );
}
