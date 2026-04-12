import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * DB user id for `Property.hostId` and booking ownership.
 * Legacy sessions may have had `sub` / `user.id` as an email — resolve via email when needed.
 */
export async function getHostUserId(): Promise<string | null> {
  const session = await auth();
  if (!session?.user) return null;

  const rawId = session.user.id;
  if (rawId && !String(rawId).includes("@")) {
    const byId = await prisma.user.findUnique({
      where: { id: rawId },
      select: { id: true },
    });
    if (byId) return byId.id;
  }

  const email = session.user.email;
  if (email) {
    const byEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return byEmail?.id ?? null;
  }

  return null;
}
