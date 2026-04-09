import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PrivacyEditor from "./PrivacyEditor";
import { DEFAULT_PRIVACY_POLICY } from "@/lib/constants";

export default async function DashboardPrivacyPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const property = await prisma.property.findFirst({
    where: { hostId: session.user.id },
  });

  if (!property) {
    redirect("/dashboard/settings");
  }

  // Use customized policy if available, otherwise load the default constant
  const initialContent = property.privacyPolicy || DEFAULT_PRIVACY_POLICY;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tighter font-serif italic text-[#C5A059]">Mamounia Privacy Policy</h1>
        <p className="text-[#6B635C] font-medium opacity-60 max-w-2xl text-sm">
          Use this HTML editor to customize your guest privacy policy. This content will be displayed on the public check-in page and throughout the guest experience.
        </p>
      </div>

      <PrivacyEditor propertyId={property.id} initialContent={initialContent} />
    </div>
  );
}
