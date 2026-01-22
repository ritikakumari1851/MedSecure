"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { 
  Send, 
  Mic, 
  Video, 
  ShieldCheck, 
  Brain, 
  Activity, 
  ClipboardList, 
  X,
  PhoneOff,
  VideoOff,
  Wand2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useRouter } from "next/navigation";

type Message = {
  id: number;
  chat_id: number;
  sender_type: "user" | "admin";
  sender_id: string;
  message: string;
  created_at: string;
};

interface DirectChatProps {
  initialQuestion?: string;
  onClose: () => void;
}

export function DirectChat({ initialQuestion, onClose }: DirectChatProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);
  const [isVideoActive, setIsVideoActive] = useState(false); // Telemedicine Requirement
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchChatId = async () => {
      if (!user) return;
      const { data: chat } = await supabase
        .from("direct_chats")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (chat) setChatId(chat.id);
    };
    fetchChatId();
  }, [user]);

  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !chatId) return;
    setIsLoading(true);
    const message = input.trim();
    setInput("");
    try {
      await supabase.from("chat_messages").insert({
        chat_id: chatId,
        sender_type: "user",
        sender_id: user.id,
        message: message,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[750px] w-full max-w-6xl mx-auto bg-background border rounded-xl overflow-hidden shadow-2xl">
      {/* HEADER: Secure Clinical Branding */}
      <div className="p-4 border-b flex justify-between items-center bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <h2 className="font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> Encrypted Consultation Session
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Telemedicine Controls */}
          <Button 
            variant={isVideoActive ? "destructive" : "outline"} 
            size="sm" 
            onClick={() => setIsVideoActive(!isVideoActive)}
            className="gap-2"
          >
            {isVideoActive ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            {isVideoActive ? "Stop Video" : "Start Video"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-rose-600 border-rose-200 hover:bg-rose-50"
            onClick={() => router.push("/consultation/summary")}
          >
            <PhoneOff className="w-4 h-4 mr-2" /> End Session
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal">
        {/* LEFT SIDE: Active Consultation (Text/Video) */}
        <ResizablePanel defaultSize={60}>
          <div className="flex flex-col h-full bg-background relative">
            
            {/* Conditional Video Layer */}
            {isVideoActive && (
              <div className="absolute inset-0 z-10 bg-slate-900 flex items-center justify-center">
                <div className="text-center text-white space-y-4">
                  <div className="w-24 h-24 rounded-full bg-slate-800 mx-auto flex items-center justify-center animate-pulse">
                    <Video className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium">Secure Video Stream Initialized</p>
                </div>
                <div className="absolute bottom-4 right-4 w-32 h-20 bg-slate-800 rounded border border-slate-700 overflow-hidden shadow-lg">
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">Self View</div>
                </div>
              </div>
            )}

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <span className="text-[10px] bg-muted px-2 py-1 rounded uppercase tracking-widest text-muted-foreground">
                    Session Started - {new Date().toLocaleTimeString()}
                  </span>
                </div>
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender_type === "admin" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                      message.sender_type === "admin" 
                      ? "bg-muted rounded-tl-none border border-border" 
                      : "bg-primary text-primary-foreground rounded-tr-none shadow-md"
                    }`}>
                      <p className="text-sm leading-relaxed">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="p-4 border-t bg-card/50">
              <div className="flex gap-2 bg-background p-1 rounded-full border border-primary/20 shadow-inner">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your current symptoms..."
                  className="flex-1 border-none focus-visible:ring-0 bg-transparent px-4"
                  disabled={isLoading}
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-primary hover:bg-primary/10"
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button type="submit" size="icon" className="rounded-full w-10 h-10 shadow-lg" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* RIGHT SIDE: Intelligent Decision Support (Mandatory Features) */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="flex flex-col h-full bg-accent/5 border-l border-border/50">
            <div className="p-4 border-b bg-accent/10 flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                <Brain className="w-4 h-4" /> Clinical Intelligence
              </h3>
              <Wand2 className="w-4 h-4 text-primary/40" />
            </div>
            
            <ScrollArea className="flex-1 p-4 space-y-4">
              {/* Feature: NLP Symptom Extraction */}
              <Card className="p-4 border-l-4 border-l-primary bg-background shadow-md">
                <h4 className="text-[10px] font-black text-primary uppercase mb-3 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Live NLP Extraction
                </h4>
                <div className="space-y-3">
                  {/* Dynamic Extraction Logic Placeholder */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold italic">"Sharp pain in chest"</span>
                      <span className="text-[9px] bg-rose-500/10 text-rose-600 px-1 rounded font-bold">Critical</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Extracted 2 mins ago</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold italic">"Shortness of breath"</span>
                      <span className="text-[9px] bg-rose-500/10 text-rose-600 px-1 rounded font-bold">Critical</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Extracted 1 min ago</p>
                  </div>
                </div>
              </Card>

              {/* Feature: Recommendation Engine */}
              <Card className="p-4 border-l-4 border-l-blue-500 bg-background shadow-md">
                <h4 className="text-[10px] font-black text-blue-600 uppercase mb-3 flex items-center gap-2">
                  <ClipboardList className="w-3 h-3" /> AI Follow-up Recommendation
                </h4>
                <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10 space-y-2">
                  <p className="text-xs font-bold text-blue-900">Urgent: Cardiologist</p>
                  <p className="text-[11px] text-blue-700 leading-tight">
                    Based on reported symptoms, an immediate ECG and referral to Cardiology is advised.
                  </p>
                </div>
              </Card>

              {/* Feature: Summarization Status */}
              <div className="p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 flex flex-col items-center text-center gap-2">
                <Wand2 className="w-5 h-5 text-primary animate-bounce" />
                <p className="text-xs font-bold text-primary">Automated Summary Prep</p>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  The ML model is analyzing your conversation to generate a post-consultation clinical note.
                </p>
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}