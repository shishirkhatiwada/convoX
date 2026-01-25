import { isAuthorized } from "@/lib/isAuth";
import Link from "next/link";


const NavBar = async () => {
  const user = await isAuthorized();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 transistion-all duration-300 backdrop-blur-sm border-b border-white/5 bg-[#030357]/50 ">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between ">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-between">
            <div className="w-2.5 h-2.5 bg-black rounded-[1px]"></div>
          </div>
          <span className="text-sm font-medium tracking-tight text-white/90">
            ConvoX
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-light text-zinc-400">
          <Link
            href="#features"
            className="hover:text-white/90 transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link
            href="#features"
            className="hover:text-white/90 transition-colors duration-200"
          >
            Integration
          </Link>
          <Link
            href="#features"
            className="hover:text-white/90 transition-colors duration-200"
          >
            Features
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="h-10 px-10 rounded-xl bg-white/10 text-white/90 hover:bg-white/20 transition-all flex items-center gap-2"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link
                href={"/api/auth"}
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Login
              </Link>

              <Link
                href={"/api/auth"}
                className="text-xs font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
