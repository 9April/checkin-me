import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateProperty } from "./actions";
import PropertySettingsForm from "./PropertySettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Verify the user exists in the database to avoid P2003 (FK constraint violation)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    // If user doesn't exist in DB but has a session, they are in a stale state
    redirect("/login");
  }

  let property = await prisma.property.findFirst({
    where: { hostId: session.user.id }
  });
  
  if (!property) {
    property = await prisma.property.create({
      data: {
        name: "My Property",
        hostId: session.user.id,
        checkinTime: "15:00",
        checkoutTime: "11:00",
        houseRules: JSON.stringify([
          "1. No loud music after 10PM",
          "2. No smoking inside",
          "3. Pets allowed on request"
        ])
      }
    });
  }

  // Parse house rules
  let rulesText = "";
  try {
    const rules = JSON.parse(property.houseRules || "[]");
    if (Array.isArray(rules)) {
      rulesText = rules.join('\n');
    }
  } catch (e) {
    rulesText = property.houseRules || "";
  }

  return (
    <div className="max-w-4xl space-y-8">
      <PropertySettingsForm property={property as any} initialRules={rulesText} />
    </div>
  );
}
