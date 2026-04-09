import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PrivacyEditor from "./PrivacyEditor";
import fs from 'fs';
import path from 'path';

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

  let initialContent = property.privacyPolicy || "";

  // If DB is empty, load the default template
  if (!initialContent) {
    try {
      const filePath = path.join(process.cwd(), 'app', 'privacy', 'privacy-policy.html');
      initialContent = fs.readFileSync(filePath, 'utf8');
      
      // Cleanup the default HTML if it includes the head/body tags for the editor
      // We want the inner content primarily, but the editor can handle the full thing.
    } catch (e) {
      initialContent = "<!-- Privacy Policy Template -->\n<h1>Privacy Policy</h1>\n<p>Enter your legal terms here...</p>";
    }
  }

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
