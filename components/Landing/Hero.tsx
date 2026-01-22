"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Video, Brain, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchForm } from "../search-form";

export default function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  
  // Updated titles to reflect Problem Statement 3 requirements
  const titles = useMemo(
    () => [
      "AI diagnosis",
      "secure video",
      "smart insights",
      "clinical support",
      "private care",
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative bg-background">
      <div className="absolute inset-0 bg-dot-black/[0.2] dark:bg-dot-white/[0.2]">
        <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1200px] flex items-center justify-center">
        <div className="flex gap-8 py-12 lg:py-10 items-center justify-center flex-col text-center">
          
          <div className="md:mt-6 flex gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
              Secure Consultations <ShieldCheck className="w-4 h-4 text-rose-500" />
            </Button>
          </div>

          <div className="flex gap-6 flex-col items-center">
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-regular">
              <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
                Telemedicine powered by
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 h-[70px] md:h-[100px]">
                 
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold py-2"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Subtext updated to emphasize AI and Decision Support */}
            <p className="text-sm md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center mx-auto dark:text-gray-300">
              <span className="font-bold text-black italic dark:text-white">
                MedSecure
              </span>{" "}
              is a next-generation telemedicine platform. We combine encrypted video 
              consultations with intelligent decision support to extract symptoms 
              and provide real-time clinical insights for better care.
            </p>

            <div className="flex flex-row gap-3 mt-4">
               <Button size="lg" className="gap-4 bg-rose-600 hover:bg-rose-700">
                Start Consultation <Video className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-4">
                View AI Insights <Brain className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}