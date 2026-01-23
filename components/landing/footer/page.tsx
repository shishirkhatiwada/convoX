import {
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  Rocket,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              ConvoX
            </h2>
            <p className="text-sm text-zinc-400 max-w-xs">
              Build smarter conversations. Create, deploy, and scale AI chat
              experiences with confidence.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="hover:text-white transition cursor-pointer">
                Features
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Pricing
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Integrations
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Changelog
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">
              Social
            </h3>

            <div className="flex items-center gap-4">
              <a
                aria-label="GitHub"
                className="text-zinc-400 hover:text-white 
                transition-all duration-200 hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                aria-label="Twitter / X"
                className="text-zinc-400 hover:text-white 
                transition-all duration-200 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>

              <a
                aria-label="LinkedIn"
                className="text-zinc-400 hover:text-white 
                transition-all duration-200 hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a
                aria-label="Community"
                className="text-zinc-400 hover:text-white 
                transition-all duration-200 hover:scale-110"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              <a
                aria-label="Launch"
                className="text-zinc-400 hover:text-white 
                transition-all duration-200 hover:scale-110"
              >
                <Rocket className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <span>
            © {new Date().getFullYear()} ConvoX. All rights reserved.
          </span>
          <span className="text-zinc-600">
            Designed for modern conversations
          </span>
        </div>

      </div>
    </footer>
  );
}
