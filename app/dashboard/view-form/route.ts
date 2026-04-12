import { prisma } from "@/lib/prisma";
import { getHostUserId } from "@/lib/session-host-id";
import {
  attachSlugToNewProperty,
  publicCheckInPath,
} from "@/lib/property-slug";
import { redirect } from "next/navigation";

export async function GET() {
  const hostId = await getHostUserId();
  if (!hostId) {
    redirect("/login");
  }

  let property = await prisma.property.findFirst({
    where: { hostId },
  });

  if (!property) {
    redirect("/dashboard/settings");
  }

  if (!property.slug) {
    property = await attachSlugToNewProperty(prisma, property.id, property.name);
  }

  redirect(publicCheckInPath(property));
}
