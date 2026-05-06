'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Mail, MailOpen } from 'lucide-react';
import { useUsers } from '@/lib/users';
import { useContacts } from '@/lib/contacts';
import { useNewsletterSubscribers } from '@/lib/newsletter';
import { ContactInquiry } from '@/lib/types';

export default function DashboardPage() {
  // Fetch data from APIs
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { data: contactsData, isLoading: contactsLoading } = useContacts();
  const { data: newsletterData, isLoading: newsletterLoading } = useNewsletterSubscribers();

  // Calculate stats
  const totalUsers = usersData?.meta?.total || 0;
  const totalInquiries = contactsData?.data?.length || 0;
  const pendingInquiries = contactsData?.data?.filter((c: ContactInquiry) => c.status === 'pending').length || 0;
  const totalNewsletterSubscribers = newsletterData?.data?.length || 0;

  const stats = [
    {
      name: 'Total Users',
      value: usersLoading ? '...' : totalUsers.toString(),
      icon: Users,
      change: `${totalUsers} registered`,
      changeType: 'neutral' as const,
    },
    {
      name: 'Contact Inquiries',
      value: contactsLoading ? '...' : totalInquiries.toString(),
      icon: Mail,
      change: `${pendingInquiries} pending`,
      changeType: 'neutral' as const,
    },
    {
      name: 'Newsletter',
      value: newsletterLoading ? '...' : totalNewsletterSubscribers.toString(),
      icon: MailOpen,
      change: `${totalNewsletterSubscribers} subscribers`,
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.name} 
              className="border-none shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-brand-gray">
                  {stat.name}
                </CardTitle>
                <div className="p-2 bg-brand-cream rounded-xl">
                  <Icon className="w-5 h-5 text-brand-rust stroke-[1.5]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-bold text-brand-charcoal">
                  {stat.value}
                </div>
                <p className={`text-sm mt-2 ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600' 
                    : 'text-brand-gray'
                }`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

     
      {/* Recent Activity */}
      <Card className="border-none shadow-lg rounded-3xl hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-brand-charcoal">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-brand-cream/30 rounded-xl">
              <div>
                <p className="font-medium text-brand-charcoal">New property added</p>
                <p className="text-sm text-brand-gray">Luxury Villa in Santorini</p>
              </div>
              <span className="text-sm text-brand-gray">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-brand-cream/30 rounded-xl">
              <div>
                <p className="font-medium text-brand-charcoal">New inquiry received</p>
                <p className="text-sm text-brand-gray">From john@example.com</p>
              </div>
              <span className="text-sm text-brand-gray">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-brand-cream/30 rounded-xl">
              <div>
                <p className="font-medium text-brand-charcoal">User registered</p>
                <p className="text-sm text-brand-gray">sarah.jones@email.com</p>
              </div>
              <span className="text-sm text-brand-gray">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
