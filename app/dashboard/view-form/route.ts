import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const property = await prisma.property.findFirst({
    where: { hostId: session.user.id },
    select: { id: true }
  });

  if (!property) {
    redirect("/dashboard/settings");
  }

  redirect(`/check-in/${property.id}`);
}
