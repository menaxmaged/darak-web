'use client';

import { useState } from 'react';
import { Bell, Send, Users, Building2, Briefcase, FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useNotifications, useSendNotification } from '@/Modules/eyoot-notifications/eyoot-notifications';
import { formatDateTime } from '@/lib/status-helpers';
import { Notification, NotificationTarget } from '@/lib/eyoot-types';

const TARGET_CONFIG: Record<NotificationTarget, { label: string; description: string; icon: React.ElementType }> = {
  all: { label: 'All Students', description: 'Send to every registered student', icon: Users },
  'signed-up-only': { label: 'Signed-Up Only', description: 'Students who never applied', icon: Users },
  'internship-applicants': { label: 'Internship Applicants', description: 'Students with at least one application', icon: FileText },
  'by-company': { label: 'By Company', description: 'Students who applied to a specific company', icon: Building2 },
  'by-position': { label: 'By Position', description: 'Students who applied to a specific position', icon: Briefcase },
  'by-status': { label: 'By Status', description: 'Students at a specific application stage', icon: FileText },
  'missing-ibm-proof': { label: 'Missing IBM Proof', description: 'Students who haven\'t uploaded IBM proof', icon: Bell },
  'missing-interview': { label: 'Missing Interview Selection', description: 'Students who haven\'t picked an interview slot', icon: Clock },
};

function ComposeCard() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState<NotificationTarget>('all');
  const [type, setType] = useState<'in-app' | 'email'>('in-app');
  const { mutate: send, isPending } = useSendNotification();

  const handleSend = () => {
    if (!title || !body) return;
    send({ title, body, target, type, status: 'sent' }, {
      onSuccess: () => { setTitle(''); setBody(''); },
    });
  };

  const TargetIcon = TARGET_CONFIG[target].icon;

  return (
    <Card className="border border-border shadow-sm rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          Compose Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Target */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Audience</Label>
          <Select value={target} onValueChange={(v) => setTarget(v as NotificationTarget)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(TARGET_CONFIG) as [NotificationTarget, typeof TARGET_CONFIG[NotificationTarget]][]).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <cfg.icon className="w-4 h-4 text-muted-foreground" />
                    <span>{cfg.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <TargetIcon className="w-3.5 h-3.5" />
            {TARGET_CONFIG[target].description}
          </p>
        </div>

        {/* Delivery type */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Delivery Method</Label>
          <div className="flex gap-2">
            {(['in-app', 'email'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-colors
                  ${type === t ? 'bg-primary text-white border-primary' : 'border-border hover:bg-muted'}`}
              >
                {t === 'in-app' ? 'In-App' : 'Email'}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Title</Label>
          <Input
            placeholder="Notification title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Body */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Message</Label>
          <Textarea
            placeholder="Write your message here…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="resize-none h-24 text-sm"
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={isPending || !title || !body}
          className="w-full gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]"
        >
          <Send className="w-4 h-4" />
          {isPending ? 'Sending…' : 'Send Notification'}
        </Button>
      </CardContent>
    </Card>
  );
}

function HistoryRow({ notif }: { notif: Notification }) {
  const targetCfg = TARGET_CONFIG[notif.target];

  return (
    <div className="flex items-start gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <targetCfg.icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-sm text-foreground">{notif.title}</p>
          <Badge variant={notif.status === 'sent' ? 'success' : 'warning'} className="text-xs">
            {notif.status}
          </Badge>
          <Badge variant="secondary" className="text-xs capitalize">{notif.type}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.body}</p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <span>{targetCfg.label}</span>
          {notif.recipientCount !== undefined && (
            <span>→ {notif.recipientCount} recipients</span>
          )}
          {notif.sentAt && <span>{formatDateTime(notif.sentAt)}</span>}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const notifications: Notification[] = data?.data ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      <div>
        <ComposeCard />
      </div>

      <div>
        <Card className="border border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Notification History</CardTitle>
            <Badge variant="gray">{notifications.length}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="font-medium text-sm">No notifications sent yet</p>
              </div>
            ) : (
              notifications.map((n) => <HistoryRow key={n.id} notif={n} />)
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
