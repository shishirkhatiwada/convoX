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
  const metadataCookie = cookieStore.get("metadata");
  return (
    <div
      className={` bg-[#030303] min-h-screen flex flex-col p-0 antialiased text-zinc-100 selection:bg-zinc-800 font-sans`}
    >
      {metadataCookie?.value ? <>{children}</> : children}
    </div>
  );
}
