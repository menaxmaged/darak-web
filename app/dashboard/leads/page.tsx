'use client';

import { useState } from 'react';
import { Phone, MessageCircle, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLeads } from '@/Modules/leads/hooks';
import { TablePagination } from '@/components/ui/table-pagination';
import type { ContactType } from '@/Modules/leads/types';

const PAGE_SIZE = 20;

const CONTACT_COLORS: Record<ContactType, string> = {
  call:      'bg-blue-100 text-blue-700',
  whatsapp:  'bg-green-100 text-green-700',
};

// ─── Stat / Filter Card ────────────────────────────────────────────────────────

function StatFilterCard({
  icon: Icon, iconBg, iconColor, count, label, active, onClick,
}: {
  icon: React.ElementType; iconBg: string; iconColor: string;
  count: number | undefined; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-card rounded-xl border p-4 text-left w-full transition-all ${
        active ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{count ?? '—'}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
  const meta  = leadsRes?.meta;

  // Lightweight count queries — independent of the active page filter
  const { data: allRes }  = useLeads({ limit: 1 });
  const { data: callRes } = useLeads({ contactType: 'call',      limit: 1 });
  const { data: waRes }   = useLeads({ contactType: 'whatsapp',  limit: 1 });

  return (
    <>
      {/* Stat / Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatFilterCard
          icon={Activity} iconBg="bg-secondary" iconColor="text-foreground"
          count={allRes?.meta?.totalItems} label="Total Leads"
          active={typeFilter === 'all'} onClick={() => setType('all')}
        />
        <StatFilterCard
          icon={Phone} iconBg="bg-blue-100" iconColor="text-blue-600"
          count={callRes?.meta?.totalItems} label="Calls"
          active={typeFilter === 'call'} onClick={() => setType('call')}
        />
        <StatFilterCard
          icon={MessageCircle} iconBg="bg-green-100" iconColor="text-green-600"
          count={waRes?.meta?.totalItems} label="WhatsApp"
          active={typeFilter === 'whatsapp'} onClick={() => setType('whatsapp')}
        />
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
                        {lead.contact_type === 'call'
                          ? <Phone className="h-3.5 w-3.5" />
                          : <MessageCircle className="h-3.5 w-3.5" />}
                        {lead.contact_type === 'whatsapp' ? 'WhatsApp' : 'Call'}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-mono text-muted-foreground">{lead.listing_id}</td>
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
          <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No {typeFilter !== 'all' ? typeFilter : ''} leads found.
          </p>
        </div>
      )}

      <TablePagination meta={meta} page={page} onPageChange={setPage} />
    </>
  );
}
