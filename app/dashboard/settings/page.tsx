'use client';

import { useState } from 'react';
import { Settings, Save, BadgeCheck, Bell, Briefcase, Shield, Palette, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

function Tab({ active, onClick, icon: Icon, label }: {
  active: boolean; onClick: () => void; icon: React.ElementType; label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors
        ${active ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function SettingRow({ label, description, children }: {
  label: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-border/50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0 min-w-48">{children}</div>
    </div>
  );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
        ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<'application' | 'ibm' | 'notifications' | 'capacity' | 'branding' | 'permissions'>('application');

  // Application Rules
  const [minAge, setMinAge] = useState('18');
  const [allowMultipleApps, setAllowMultipleApps] = useState(true);
  const [requireIBMByDefault, setRequireIBMByDefault] = useState(false);
  const [requireVolunteering, setRequireVolunteering] = useState(false);

  // IBM Badge
  const [ibmBadgeAutoAssign, setIbmBadgeAutoAssign] = useState(true);
  const [ibmCourseDefaultUrl, setIbmCourseDefaultUrl] = useState('');

  // Notifications
  const [notifyOnApproval, setNotifyOnApproval] = useState(true);
  const [notifyOnDecline, setNotifyOnDecline] = useState(true);
  const [notifyOnIBMReview, setNotifyOnIBMReview] = useState(true);
  const [notifyOnCertificate, setNotifyOnCertificate] = useState(true);

  const tabs = [
    { key: 'application', icon: FileText, label: 'Application Rules' },
    { key: 'ibm', icon: BadgeCheck, label: 'IBM Badge' },
    { key: 'notifications', icon: Bell, label: 'Notifications' },
    { key: 'capacity', icon: Briefcase, label: 'Capacity Rules' },
    { key: 'branding', icon: Palette, label: 'Branding' },
    { key: 'permissions', icon: Shield, label: 'Permissions' },
  ] as const;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Tab nav */}
      <div className="flex flex-wrap gap-2 bg-muted/40 rounded-2xl p-1.5">
        {tabs.map((t) => (
          <Tab
            key={t.key}
            active={tab === t.key}
            onClick={() => setTab(t.key)}
            icon={t.icon}
            label={t.label}
          />
        ))}
      </div>

      {/* Application Rules */}
      {tab === 'application' && (
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Application Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingRow label="Minimum Age" description="Minimum age required to apply. Age is auto-verified via National ID.">
              <Input value={minAge} onChange={(e) => setMinAge(e.target.value)} type="number" min="16" max="30" className="w-32 text-sm" />
            </SettingRow>
            <SettingRow label="Allow Multiple Applications" description="Let students apply to more than one position simultaneously.">
              <ToggleSwitch enabled={allowMultipleApps} onChange={setAllowMultipleApps} />
            </SettingRow>
            <SettingRow label="Require IBM Course by Default" description="Apply IBM course stage to all new applications by default.">
              <ToggleSwitch enabled={requireIBMByDefault} onChange={setRequireIBMByDefault} />
            </SettingRow>
            <SettingRow label="Require Volunteering by Default" description="Require volunteering completion before certificate release.">
              <ToggleSwitch enabled={requireVolunteering} onChange={setRequireVolunteering} />
            </SettingRow>
            <div className="pt-4">
              <Button className="gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]">
                <Save className="w-4 h-4" /> Save Rules
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* IBM Badge */}
      {tab === 'ibm' && (
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">IBM Badge Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingRow label="Auto-assign Badge on Proof Approval" description="Automatically add IBM badge to student profile when proof is approved.">
              <ToggleSwitch enabled={ibmBadgeAutoAssign} onChange={setIbmBadgeAutoAssign} />
            </SettingRow>
            <SettingRow label="Default IBM Course URL" description="The external IBM course link shown to students by default.">
              <Input
                value={ibmCourseDefaultUrl}
                onChange={(e) => setIbmCourseDefaultUrl(e.target.value)}
                placeholder="https://ibm.com/training/…"
                className="text-sm"
              />
            </SettingRow>
            <div className="pt-4">
              <Button className="gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]">
                <Save className="w-4 h-4" /> Save IBM Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Automatic Notification Triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingRow label="On Application Approval" description="Notify student when their application is approved.">
              <ToggleSwitch enabled={notifyOnApproval} onChange={setNotifyOnApproval} />
            </SettingRow>
            <SettingRow label="On Application Decline" description="Notify student when their application is declined.">
              <ToggleSwitch enabled={notifyOnDecline} onChange={setNotifyOnDecline} />
            </SettingRow>
            <SettingRow label="On IBM Proof Review" description="Notify student when their IBM proof is reviewed (approved/rejected).">
              <ToggleSwitch enabled={notifyOnIBMReview} onChange={setNotifyOnIBMReview} />
            </SettingRow>
            <SettingRow label="On Certificate Upload" description="Notify student when their certificate is uploaded.">
              <ToggleSwitch enabled={notifyOnCertificate} onChange={setNotifyOnCertificate} />
            </SettingRow>
            <div className="pt-4 space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Approval Email Template</Label>
                <Textarea placeholder="Congratulations! Your application to {company} for {position} has been approved…" className="text-sm resize-none h-24" />
              </div>
              <Button className="gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]">
                <Save className="w-4 h-4" /> Save Notification Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Capacity Rules */}
      {tab === 'capacity' && (
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Capacity Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingRow label="Block Approval at Full Capacity" description="Prevent admins from approving more students than a position's capacity.">
              <ToggleSwitch enabled={true} onChange={() => {}} />
            </SettingRow>
            <SettingRow label="Capacity Warning Threshold" description="Show warnings when a position reaches this percentage of capacity.">
              <Select defaultValue="80">
                <SelectTrigger className="w-32 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60%</SelectItem>
                  <SelectItem value="70">70%</SelectItem>
                  <SelectItem value="80">80%</SelectItem>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <div className="pt-4">
              <Button className="gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]">
                <Save className="w-4 h-4" /> Save Capacity Rules
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Branding */}
      {tab === 'branding' && (
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Branding</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingRow label="Platform Name" description="Displayed in emails and notifications.">
              <Input defaultValue="Eyoot" className="text-sm" />
            </SettingRow>
            <SettingRow label="Support Email" description="Students can contact this email for help.">
              <Input defaultValue="support@eyoot.com" type="email" className="text-sm" />
            </SettingRow>
            <div className="pt-4">
              <Button className="gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]">
                <Save className="w-4 h-4" /> Save Branding
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permissions */}
      {tab === 'permissions' && (
        <Card className="border border-border shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure what each admin role can access and modify within the dashboard.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Section</th>
                    {['Super Admin', 'Apps Manager', 'Student Mgr', 'Content Mgr', 'Analytics'].map((r) => (
                      <th key={r} className="text-center py-2 px-2 text-muted-foreground font-medium">{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { section: 'Dashboard', access: [true, true, true, true, true] },
                    { section: 'Students', access: [true, true, true, false, false] },
                    { section: 'Applications', access: [true, true, false, false, false] },
                    { section: 'Companies', access: [true, true, false, false, false] },
                    { section: 'Positions', access: [true, true, false, false, false] },
                    { section: 'IBM Proofs', access: [true, true, false, false, false] },
                    { section: 'Workshops', access: [true, false, false, true, false] },
                    { section: 'Courses', access: [true, false, false, true, false] },
                    { section: 'Reels', access: [true, false, false, true, false] },
                    { section: 'Analytics', access: [true, true, true, true, true] },
                    { section: 'Settings', access: [true, false, false, false, false] },
                  ].map((row) => (
                    <tr key={row.section} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 pr-4 font-medium text-foreground">{row.section}</td>
                      {row.access.map((has, i) => (
                        <td key={i} className="py-2.5 px-2 text-center">
                          <span className={has ? 'text-emerald-600' : 'text-muted-foreground/30'}>
                            {has ? '✓' : '✗'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Contact a Super Admin to modify role permissions.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
