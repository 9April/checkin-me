/**
 * One-off: set Property.slug from name for rows where slug is null.
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/backfill-property-slugs.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { attachSlugToNewProperty } from "../lib/property-slug";

async function main() {
  const prisma = new PrismaClient();
  const rows = await prisma.property.findMany({ where: { slug: null } });
  for (const p of rows) {
    await attachSlugToNewProperty(prisma, p.id, p.name);
    console.log("slug set:", p.name);
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
