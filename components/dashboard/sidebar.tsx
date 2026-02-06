"use client";
import { metadata } from "@/db/schema";
import { useUser } from "@/hooks/useUser";
import {
  BookAIcon,
  Bot,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Slice,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Knowledge",
    href: "/dashboard/knowledge",
    icon: BookAIcon,
  },
  {
    label: "Sections",
    href: "/dashboard/sections",
    icon: Layers,
  },
  {
    label: "Chatbot",
    href: "/dashboard/chatbot",
    icon: Bot,
  },
  {
    label: "Conversation",
    href: "/dashboard/conversations",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { email } = useUser();
  const [metadata, setMetadata] = useState<any>();
  const [isLoading, seIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      const response = await fetch("/api/metadata/fetch");
      const res = await response.json();
      setMetadata(res.data);
      seIsLoading(false);
    };
    fetchMetadata();
  }, [email]);

  return (
    <aside className="w-64 border-r border-white/5 bg-[#050509] flex-col h-screen fixed left-0 top-0 z-40 hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          {/* logo mark */}

          <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-between">
            <div className="w-2.5 h-2.5 bg-black rounded-[1px]"></div>
          </div>
          <span className="text-sm font-medium tracking-tight text-white/90">
            ConvoX
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 ${isActive ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-light">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* profile section */}

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors group">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
            <span className="text-xs text-zinc-400 group-hover:text-white ">
              {metadata?.business_name?.slice(0, 1).toUpperCase() || ".."}
            </span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-zinc-300 truncate group-hover:text-white ">
                {isLoading ? "Loading..." : metadata?.business_name}
            </span>
            <span className="text-xs text-zinc-500 truncate">{email}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
