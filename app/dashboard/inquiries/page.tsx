'use client';

import { useContacts, useUpdateContactStatus } from '@/lib/contacts';
import { getErrorMessage } from '@/lib/api-client';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Mail, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { ContactInquiry } from '@/lib/types';

export default function InquiriesPage() {
  const { data: contactsData, isLoading } = useContacts();
  const updateStatusMutation = useUpdateContactStatus();
  const handleStatusUpdate = async (
    inquiry: ContactInquiry,
    newStatus: 'pending' | 'reviewed' 
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: inquiry.id,
        status: newStatus,
      });
      toast.success(`Inquiry status updated to ${newStatus}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return <ResourceSkeleton rows={6} />;
  }

  // Ensure inquiries is always an array
  const inquiries = Array.isArray(contactsData)
    ? contactsData
    : (contactsData && Array.isArray(contactsData.data))
      ? contactsData.data
      : [];
  const pendingCount = inquiries.filter((i) => i.status === 'pending').length;
  const reviewedCount = inquiries.filter((i) => i.status === 'reviewed').length;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="flex md:flex-row gap-48 justify-between w-full  ">
        <Card className="border-none shadow-lg rounded-3xl w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-brand-gray">
              Pending
            </CardTitle>
            <MessageSquare className="w-5 h-5 text-brand-rust" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-brand-charcoal">
              {pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg rounded-3xl w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-brand-gray">
              Reviewed
            </CardTitle>
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-brand-charcoal">
              {reviewedCount}
            </div>
          </CardContent>
        </Card>

       
      </div>

      {/* Inquiries Table */}
      <Card className="border-none shadow-lg rounded-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-brand-charcoal">
            All Inquiries ({inquiries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-brand-cream/50">
                <TableRow className="hover:bg-brand-cream/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Message</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-brand-gray py-8">
                      No inquiries yet
                    </TableCell>
                  </TableRow>
                ) : (
                  inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id} className="hover:bg-brand-cream/30">
                      <TableCell className="font-medium text-brand-charcoal">
                        {inquiry.firstName} {inquiry.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-brand-gray" />
                            <span className="text-brand-charcoal">{inquiry.email}</span>
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-brand-gray" />
                              <span className="text-brand-gray">{inquiry.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-brand-gray line-clamp-2">
                          {inquiry.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            inquiry.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : inquiry.status === 'reviewed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {inquiry.status}
                        </span>
                      </TableCell>
                    
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-brand-cream"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(inquiry, 'pending')}
                              disabled={inquiry.status === 'pending'}
                            >
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(inquiry, 'reviewed')}
                              disabled={inquiry.status === 'reviewed'}
                            >
                              Mark as Reviewed
                            </DropdownMenuItem>
                           
                          </DropdownMenuContent>
                        </DropdownMenu>
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
