
import Sidebar from "@/components/dashboard/sidebar";
import { cookies } from "next/headers";

export const metadata = {
  title: "ConvoX - Dashboard",
  description: "Your AI Conversations Dashboard",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const userSession = cookieStore.get("user_session");
  const metadataCookie = cookieStore.get("metadata");
  
  // Show sidebar if user is logged in (has user_session)
  const isAuthenticated = !!userSession?.value;
  
  return (
    <div
      className={` bg-[#030303] min-h-screen flex flex-col p-0 antialiased text-zinc-100 selection:bg-zinc-800 font-sans`}
    >
      {isAuthenticated ? <>
      <Sidebar/>
      <div className="flex flex-1 flex-col md:ml-64 relative min-h-screen transistion-all duration-300">
        {/* <Header/> */}
        <main className="flex-1">{children}</main>
      </div>
      </> : children}
    </div>
  );
}
