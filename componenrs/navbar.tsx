"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Shield } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Features", path: "#features" },
    { label: "Services", path: "#services" },
    { label: "About", path: "#about" },
  ];

  const handleNavigation = (path: string) => {
    if (path.startsWith("#")) {
      const element = document.querySelector(path);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(path);
    }
    setMenuOpen(false);
  };

  return (
    <div className="w-full flex justify-center">
      <nav
        className={`
          mt-4 rounded-full fixed z-50 transition-all duration-300 
          ${
            scrolled
              ? "bg-black/70 shadow-lg backdrop-blur-md w-[90vw]"
              : "bg-black/30 backdrop-blur-sm w-[95vw]"
          }
        `}
      >
        <div className="mx-auto flex items-center justify-between p-4 px-6 md:px-10 lg:px-16 relative">
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {navItems.map((item, index) => (
              <button
                key={index}
                className="font-medium text-sm text-white/80 hover:text-green-400 transition-colors"
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="md:hidden w-6"></div>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2"
          >
            <img
              src="/logo.svg"
              className="h-10"
              onClick={() => router.push("/")}
            />
          </button>

          <div className="hidden md:flex items-center">
            <button
              className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </button>
          </div>

          <button
            className="md:hidden text-white hover:text-green-400 z-30"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md rounded-2xl shadow-xl mx-4 overflow-hidden">
            <div className="flex flex-col py-2">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className="text-left px-6 py-4 text-white hover:bg-green-500/20 hover:text-green-400 transition-colors font-medium"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </button>
              ))}
              <button
                className="mx-6 my-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                onClick={() => handleNavigation("/auth/login")}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
