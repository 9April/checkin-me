import type { PrismaClient } from "@prisma/client";

/** Guest-facing check-in path: uses slug from name when set, else legacy id. */
export function publicCheckInPath(property: {
  id: string;
  slug?: string | null;
}): string {
  const s = property.slug?.trim();
  const segment = s && s.length > 0 ? s : property.id;
  return `/check-in/${encodeURIComponent(segment)}`;
}

/** URL-safe slug from display name (lowercase, hyphens, a-z0-9 only). */
export function slugifyPropertyName(name: string): string {
  const s = name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "property";
}

/**
 * Reserves a unique slug for Property.slug (global uniqueness).
 * On collision, appends -2, -3, … or a short id suffix.
 */
export async function reserveUniquePropertySlug(
  prisma: PrismaClient,
  name: string,
  excludePropertyId?: string
): Promise<string> {
  const base = slugifyPropertyName(name);
  for (let n = 0; n < 200; n++) {
    const candidate =
      n === 0 ? base : `${base}-${n + 1}`;
    const existing = await prisma.property.findFirst({
      where: {
        slug: candidate,
        ...(excludePropertyId ? { NOT: { id: excludePropertyId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  return `${base}-${excludePropertyId?.slice(-6) ?? Date.now().toString(36)}`;
}

/** Call right after `property.create` to set `slug` from `name`. */
export async function attachSlugToNewProperty(
  prisma: PrismaClient,
  propertyId: string,
  name: string
) {
  const slug = await reserveUniquePropertySlug(prisma, name, propertyId);
  return prisma.property.update({
    where: { id: propertyId },
    data: { slug },
  });
}
