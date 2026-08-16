import { prisma } from "@/lib/prisma";
import { getHostUserId } from "@/lib/session-host-id";
import {
  attachSlugToNewProperty,
  publicCheckInPath,
} from "@/lib/property-slug";
import { redirect } from "next/navigation";
import { getActiveProperty } from "@/lib/active-property";

export async function GET() {
  const hostId = await getHostUserId();
  if (!hostId) {
    redirect("/login");
  }

  let property = await getActiveProperty(hostId);

  if (!property) {
    redirect("/dashboard/settings");
  }

  if (!property.slug) {
    property = await attachSlugToNewProperty(prisma, property.id, property.name);
  }

  redirect(publicCheckInPath(property));
}
