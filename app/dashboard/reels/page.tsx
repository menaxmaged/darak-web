'use client';

import { useState } from 'react';
import {
  Search, Plus, Video, Eye, Heart, Bookmark, Share2, MoreHorizontal, Play,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useReels } from '@/Modules/reels/reels';
import { formatDate } from '@/lib/status-helpers';
import { Reel } from '@/lib/eyoot-types';

function ReelCard({ reel }: { reel: Reel }) {
  return (
    <Card className="border border-border shadow-sm rounded-2xl hover:shadow-md transition-shadow overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        {reel.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={reel.thumbnailUrl} alt={reel.title} className="w-full h-full object-cover" />
        ) : (
          <Video className="w-12 h-12 text-primary/40" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <a
            href={reel.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <Play className="w-4 h-4 text-foreground ml-0.5" />
          </a>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant={reel.status === 'published' ? 'success' : 'warning'} className="text-xs">
            {reel.status}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">{reel.title}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {reel.category && <Badge variant="secondary" className="text-xs">{reel.category}</Badge>}
              <span className="text-xs text-muted-foreground">{formatDate(reel.publishedAt)}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-4 gap-1 pt-3 border-t border-border">
          {[
            { icon: Eye, value: reel.views, label: 'Views' },
            { icon: Heart, value: reel.likes, label: 'Likes' },
            { icon: Bookmark, value: reel.saves, label: 'Saves' },
            { icon: Share2, value: reel.shares, label: 'Shares' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="w-3.5 h-3.5 mx-auto text-muted-foreground mb-0.5" />
              <p className="font-semibold text-xs">{s.value.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReelsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useReels();
  const reels: Reel[] = data?.data ?? [];

  const filtered = reels.filter((r) => {
    if (!search) return true;
    return r.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search reels…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button className="gap-2 bg-[#FFAF00] text-white hover:bg-[#e09e00]">
          <Plus className="w-4 h-4" /> Upload Reel
        </Button>
      </div>

      {!isLoading && <Badge variant="gray">{filtered.length} reels</Badge>}

      {filtered.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <Video className="w-12 h-12 opacity-20" />
          <p className="font-medium">No reels found</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="border border-border shadow-sm rounded-2xl overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="grid grid-cols-4 gap-1 pt-3 border-t border-border">
                  {[0, 1, 2, 3].map((j) => <Skeleton key={j} className="h-10 rounded" />)}
                </div>
              </CardContent>
            </Card>
          ))
          : filtered.map((r) => <ReelCard key={r.id} reel={r} />)}
      </div>
    </div>
  );
}
