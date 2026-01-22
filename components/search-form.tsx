"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Stethoscope, Sparkles } from "lucide-react";

export function SearchForm() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Logic shifted to specialist consultation rooms/scheduling
      router.push(`/consultations?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
            <Stethoscope className="w-5 h-5" />
          </div>
          <Input
            type="text"
            // Fulfills the requirement for an entry point to AI symptom extraction and specialist matching
            placeholder="Search specialists or describe symptoms (e.g. Neurologist, persistent headache)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-32 h-14 text-base bg-background/60 backdrop-blur border-primary/20 rounded-2xl focus-visible:ring-primary/50 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 shadow-inner"
          />
          <Button
            type="submit"
            size="lg"
            className="absolute right-1.5 top-1.5 h-11 rounded-xl gap-2 text-sm sm:text-base font-bold bg-primary text-primary-foreground hover:shadow-md transition-all px-4"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Book Session</span>
          </Button>
        </div>

        {/* Clinical labels to differentiate from original Hospital search */}
        <div className="flex gap-2 text-xs font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-700">
           <span className="bg-accent/50 px-2 py-1 rounded border border-primary/10">AI Symptom Analysis</span>
           <span className="bg-accent/50 px-2 py-1 rounded border border-primary/10">Secure Video Consultation</span>
        </div>
      </div>
    </form>
  );
}