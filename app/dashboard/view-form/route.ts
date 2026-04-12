import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  attachSlugToNewProperty,
  publicCheckInPath,
} from "@/lib/property-slug";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  let property = await prisma.property.findFirst({
    where: { hostId: session.user.id },
  });

  if (!property) {
    redirect("/dashboard/settings");
  }

  if (!property.slug) {
    property = await attachSlugToNewProperty(prisma, property.id, property.name);
  }

  redirect(publicCheckInPath(property));
}
