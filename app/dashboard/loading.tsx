import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 w-full">
      <Loader2 className="w-8 h-8 text-[#A8987E] animate-spin" />
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#A8987E] animate-pulse">
        Loading Data
      </p>
    </div>
  );
}
