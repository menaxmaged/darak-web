"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListingCard } from "@/components/listings/ListingCard";
import { usePublicListings } from "@/Modules/listings/listings";
import { CITIES, PROPERTY_TYPES, FINISHING_TYPES } from "@/lib/constants";

// ─── Filter panel ─────────────────────────────────────────────────────────────

interface Filters {
  status: "ready" | "offplan" | null;
  city: string | null;
  propertyType: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  minArea: string | null;
  maxArea: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  finishing: string | null;
}

interface FilterContentProps extends Filters {
  onFilter: (key: string, value: string | null) => void;
  onClear: () => void;
}

function FilterContent({ status, city, propertyType, minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, finishing, onFilter, onClear }: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Status */}
      <div>
        <label className="text-sm font-medium mb-2 block">Property Status</label>
        <div className="flex gap-2">
          <button
            onClick={() => onFilter("status", status === "ready" ? null : "ready")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              status === "ready" ? "bg-emerald-500 text-white" : "bg-secondary"
            }`}
          >
            Ready
          </button>
          <button
            onClick={() => onFilter("status", status === "offplan" ? null : "offplan")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              status === "offplan" ? "bg-blue-500 text-white" : "bg-secondary"
            }`}
          >
            Off-Plan
          </button>
        </div>
      </div>

      {/* City */}
      <div>
        <label className="text-sm font-medium mb-2 block">City</label>
        <Select value={city || "all"} onValueChange={(v) => onFilter("city", v === "all" ? null : v)}>
          <SelectTrigger>
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div>
        <label className="text-sm font-medium mb-2 block">Property Type</label>
        <Select value={propertyType || "all"} onValueChange={(v) => onFilter("type", v === "all" ? null : v)}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {PROPERTY_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium mb-2 block">Price Range (EGP)</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice || ""}
            onChange={(e) => onFilter("minPrice", e.target.value || null)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice || ""}
            onChange={(e) => onFilter("maxPrice", e.target.value || null)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Area Range */}
      <div>
        <label className="text-sm font-medium mb-2 block">Area (m²)</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minArea || ""}
            onChange={(e) => onFilter("minArea", e.target.value || null)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxArea || ""}
            onChange={(e) => onFilter("maxArea", e.target.value || null)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="text-sm font-medium mb-2 block">Bedrooms</label>
        <div className="flex gap-2 flex-wrap">
          {["any", "1", "2", "3", "4", "5+"].map((v) => (
            <button
              key={v}
              onClick={() => onFilter("bedrooms", v === "any" ? null : v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                (v === "any" && !bedrooms) || bedrooms === v
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="text-sm font-medium mb-2 block">Bathrooms</label>
        <div className="flex gap-2 flex-wrap">
          {["any", "1", "2", "3", "4+"].map((v) => (
            <button
              key={v}
              onClick={() => onFilter("bathrooms", v === "any" ? null : v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                (v === "any" && !bathrooms) || bathrooms === v
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Finishing */}
      <div>
        <label className="text-sm font-medium mb-2 block">Finishing</label>
        <Select value={finishing || "all"} onValueChange={(v) => onFilter("finishing", v === "all" ? null : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Any finishing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any finishing</SelectItem>
            {FINISHING_TYPES.map((f) => (
              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const status = searchParams.get("status") as "ready" | "offplan" | null;
  const city = searchParams.get("city");
  const propertyType = searchParams.get("type");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minArea = searchParams.get("minArea");
  const maxArea = searchParams.get("maxArea");
  const bedrooms = searchParams.get("bedrooms");
  const bathrooms = searchParams.get("bathrooms");
  const finishing = searchParams.get("finishing");
  const sortBy = (searchParams.get("sort") || "newest") as "newest" | "price_low" | "price_high" | "delivery";
  const page = Number(searchParams.get("page") || "1");

  const { data: listingsRes, isLoading } = usePublicListings({
    listingStatus: "active",
    propertyStatus: status || undefined,
    city: city || undefined,
    propertyType: propertyType || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minArea: minArea ? Number(minArea) : undefined,
    maxArea: maxArea ? Number(maxArea) : undefined,
    bedrooms: bedrooms ? Number(bedrooms) : undefined,
    bathrooms: bathrooms ? Number(bathrooms) : undefined,
    finishing: finishing || undefined,
    sortBy,
    page,
    limit: 12,
  });
  const listings = listingsRes?.data ?? [];
  const meta = listingsRes?.meta;

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
      if (key !== "page") params.delete("page");
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.replace(query ? `/search?${query}` : "/search");
  };

  const clearFilters = () => router.replace("/search");

  const activeFilters = Array.from(searchParams.entries()).filter(([k]) => k !== "sort" && k !== "page");

  const filterProps: FilterContentProps = {
    status, city, propertyType, minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, finishing,
    onFilter: updateFilter,
    onClear: clearFilters,
  };

  const FILTER_LABELS: Record<string, string> = {
    status: "Status",
    city: "City",
    type: "Type",
    minPrice: "Min Price",
    maxPrice: "Max Price",
    minArea: "Min Area",
    maxArea: "Max Area",
    bedrooms: "Beds",
    bathrooms: "Baths",
    finishing: "Finishing",
  };

  return (
    <>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Properties for Sale</h1>
            <p className="text-muted-foreground">
              {meta?.totalItems ?? listings.length} properties found
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => updateFilter("sort", v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="delivery">Soonest delivery</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilters.length > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                      {activeFilters.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent {...filterProps} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map(([key, value]) => (
              <span key={key} className="inline-flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm">
                <span className="text-muted-foreground text-xs">{FILTER_LABELS[key] ?? key}:</span>
                {value}
                <button onClick={() => updateFilter(key, null)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl p-6 border border-border max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="font-semibold">Filters</h2>
              </div>
              <FilterContent {...filterProps} />
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-secondary rounded-xl aspect-[4/5] animate-pulse" />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing, index) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex"
                    >
                      <ListingCard listing={listing} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => updateFilter("page", String(page - 1))}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter("page", String(p))}
                      >
                        {p}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= meta.totalPages}
                      onClick={() => updateFilter("page", String(page + 1))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Search() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
