'use client';

import { useNewsletterSubscribers } from '@/Modules/newsletter/newsletter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceSkeleton } from '@/components/resource-skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MailOpen, Calendar } from 'lucide-react';

export default function NewsletterPage() {
  const { data: newsletterData, isLoading } = useNewsletterSubscribers();
  console.log(newsletterData);

  if (isLoading) {
    return <ResourceSkeleton rows={6} />;
  }

  // Ensure subscribers is always an array
  const subscribers = Array.isArray(newsletterData)
    ? newsletterData
    : (newsletterData && Array.isArray(newsletterData.data))
      ? newsletterData.data
      : [];
  const activeCount = subscribers.filter((s) => s.status === 'active').length;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-lg rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-brand-gray">
              Total Subscribers
            </CardTitle>
            <MailOpen className="w-5 h-5 text-brand-rust" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-brand-charcoal">
              {subscribers.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-brand-gray">
              Active
            </CardTitle>
            <MailOpen className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-brand-charcoal">
              {activeCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-brand-gray">
              Inactive
            </CardTitle>
            <MailOpen className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-brand-charcoal">
              {subscribers.length - activeCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card className="border-none shadow-lg rounded-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-brand-charcoal">
            All Subscribers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-brand-cream/50">
                <TableRow className="hover:bg-brand-cream/50">
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Subscribed Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-brand-gray py-8">
                      No subscribers yet
                    </TableCell>
                  </TableRow>
                ) : (
                  subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id} className="hover:bg-brand-cream/30">
                      <TableCell className="font-medium text-brand-charcoal">
                        {subscriber.email}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            subscriber.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {subscriber.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-brand-gray">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(subscriber.subscribed_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
