'use client';

import { use, useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/api-client';
import { Button } from "@/components/ui/button";
import { CITIES, QUICK_FILTERS } from "@/lib/constants";
import { ArrowRight, Search, MapPin, Home, Building2 } from 'lucide-react';
import { motion } from "framer-motion";
import Link from "next/link";
import { Input } from '@/components/ui/input';
import { ListingCard } from '@/components/listings/ListingCard';

import { useListings } from '@/Modules/listings/hooks';

export default function HomePage() {
  const router = useRouter();

 const [status, setStatus] = useState<"ready" | "offplan">("ready");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: featuredListings } = useListings({
    listingStatus: "approved",
    isFeatured: true,
    limit: 6,
  });

  const { data: latestListings } = useListings({
    listingStatus: "approved",
    sortBy: "newest",
    limit: 8,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("status", status);
    if (searchQuery) params.set("q", searchQuery);
    router.push(`/search?${params.toString()}`);
  };

  return (
   <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center gradient-hero text-background overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
            alt="Hero background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="container-custom relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream
              <span className="text-gradient block">Property in Egypt</span>
            </h1>
            <p className="text-lg md:text-xl opacity-80 mb-8 max-w-xl">
              Discover ready-to-move and off-plan properties across Egypt's prime locations.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-background rounded-2xl p-4 md:p-6 shadow-xl max-w-4xl"
          >
            {/* Status Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setStatus("ready")}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  status === "ready"
                    ? "bg-emerald-500 text-background"
                    : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                <Home className="inline-block h-5 w-5 mr-2" />
                Ready to Move
              </button>
              <button
                onClick={() => setStatus("offplan")}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  status === "offplan"
                    ? "bg-blue-500 text-background"
                    : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                <Building2 className="inline-block h-5 w-5 mr-2" />
                Off-Plan
              </button>
            </div>

            {/* Search Input */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by city, area, or project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 h-14 text-lg border-2 text-foreground"
                />
              </div>
              <Button onClick={handleSearch} className="h-14 px-8 gradient-primary text-lg">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {QUICK_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => router.push(`/search?filter=${filter.id}`)}
                  className="filter-pill text-foreground"
                >
                  <span>{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings && featuredListings.data && featuredListings.data.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Featured Properties</h2>
                <p className="text-muted-foreground">Handpicked listings for you</p>
              </div>
              <Button variant="ghost" onClick={() => router.push("/search")} className="hidden md:flex">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.data.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Listings */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Latest Properties</h2>
              <p className="text-muted-foreground">Fresh listings added recently</p>
            </div>
            <Button variant="ghost" onClick={() => router.push("/search")} className="hidden md:flex">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestListings?.data?.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Areas */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-center">
            Explore Top Areas
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Discover properties in Egypt's most sought-after locations
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CITIES.map((city, index) => (
              <motion.button
                key={city}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/search?city=${encodeURIComponent(city)}`)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <img
                  src={`https://images.unsplash.com/photo-${
                    index % 2 === 0 ? "1600596542815-ffad4c1539a9" : "1600607687939-ce8a6c25118c"
                  }?w=600&q=80`}
                  alt={city}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                <div className="absolute bottom-4 left-4 text-background">
                  <h3 className="font-display font-bold text-xl">{city}</h3>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 gradient-hero text-background">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to List Your Property?
          </h2>
          <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">
            Join thousands of brokers and owners selling properties on Darak.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => router.push("/auth?mode=signup")}>
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="border-background/30  text-black hover:bg-background/10 hover:text-background" onClick={() => router.push("/pricing")}>
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
