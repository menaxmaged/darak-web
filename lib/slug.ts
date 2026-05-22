// Slug helpers for human-readable property URLs.
//
// The backend exposes listings only by numeric id (`/admin/listings/{id}`),
// so URLs embed the id as a suffix: `luxury-villa-in-new-cairo-123`.
// The slug part is decorative; the trailing id is what we fetch by.

/** Turn arbitrary text into a URL-safe slug (Unicode-aware, keeps Arabic letters). */
export function slugify(text: string | null | undefined): string {
  if (!text) return 'property';
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || 'property'
  );
}

/** Build the canonical `slug-id` segment for a listing. */
export function buildPropertySlug(listing: {
  id: number;
  title?: string | null;
  property_type?: string;
}): string {
  const base = slugify(listing.title || listing.property_type);
  return `${base}-${listing.id}`;
}

/** Extract the numeric id from a `slug-id` segment (or a bare id). Returns null if none. */
export function parseListingId(slug: string): string | null {
  const match = slug.match(/(\d+)$/);
  return match ? match[1] : null;
}
