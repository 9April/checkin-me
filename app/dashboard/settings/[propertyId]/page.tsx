import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { attachSlugToNewProperty } from "@/lib/property-slug";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateProperty } from "../actions";
import PropertySettingsForm from "../PropertySettingsForm";

export default async function SettingsPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = await params;
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

  let property = await prisma.property.findUnique({
    where: { id: propertyId, hostId: session.user.id }
  });
  
  if (!property) {
    redirect("/dashboard/settings");
  }

  if (!property.slug) {
    property = await attachSlugToNewProperty(prisma, property.id, property.name);
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
      <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-sm">
        <Link href="/dashboard/settings" className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-semibold">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="h-4 w-[1px] bg-gray-200 hidden sm:block"></div>
        <span className="font-serif text-xl italic hidden sm:block text-[#C5A059]">Settings : {property.name}</span>
      </div>
      <PropertySettingsForm property={property as any} initialRules={rulesText} />
    </div>
  );
}
