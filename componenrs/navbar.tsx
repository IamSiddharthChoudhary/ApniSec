"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [scrld, setScrld] = useState(false);
  const [mOpen, setMOpen] = useState(false);
  const [usr, setUsr] = useState<any>(null);
  const rtr = useRouter();
  const pth = usePathname();

  useEffect(() => {
    const hndlScrl = () => {
      setScrld(window.scrollY > 50);
    };
    window.addEventListener("scroll", hndlScrl);
    return () => window.removeEventListener("scroll", hndlScrl);
  }, []);

  useEffect(() => {
    const usrData = localStorage.getItem("user");
    if (usrData) {
      setUsr(JSON.parse(usrData));
    }
  }, [pth]);

  const doLogout = async () => {
    const tk = localStorage.getItem("token");
    if (tk) {
      await fetch("/api/auth/logout", { method: "POST" });
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUsr(null);
    rtr.push("/auth/login");
    setMOpen(false);
  };

  const isDash = pth?.startsWith("/dashboard") || pth?.startsWith("/profile");

  const navItms: any[] = [];

  const goTo = (path: string) => {
    if (path.startsWith("#")) {
      const el = document.querySelector(path);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      rtr.push(path);
    }
    setMOpen(false);
  };

  return (
    <div className="w-full flex justify-center">
      <nav
        className={`
          mt-4 rounded-full fixed z-50 transition-all duration-300 
          ${
            scrld
              ? "bg-black/70 shadow-lg backdrop-blur-md w-[90vw]"
              : "bg-black/30 backdrop-blur-sm w-[95vw]"
          }
        `}
      >
        <div className="mx-auto flex items-center justify-between p-4 px-6 md:px-10 lg:px-16 relative">
          {!isDash && (
            <div className="hidden md:flex items-center gap-8 lg:gap-12">
              {navItms.map((itm, idx) => (
                <button
                  key={idx}
                  className="font-medium text-sm text-white/80 hover:text-green-400 transition-colors"
                  onClick={() => goTo(itm.path)}
                >
                  {itm.label}
                </button>
              ))}
            </div>
          )}

          {isDash && <div className="w-6"></div>}
          {!isDash && <div className="md:hidden w-6"></div>}

          <button
            onClick={() => rtr.push("/")}
            className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2 hover:scale-105 transition-transform"
          >
            <img src="/logo.svg" className="h-10" alt="Logo" />
          </button>

          <div className="hidden md:flex items-center gap-3">
            {usr ? (
              <>
                {isDash && (
                  <span className="text-white/80 text-sm">{usr.name}</span>
                )}
                {!isDash && (
                  <>
                    <button
                      className="px-5 py-2 rounded-full bg-green-600/20 hover:bg-green-600/30 text-white font-semibold text-sm transition-colors flex items-center gap-2"
                      onClick={() => rtr.push("/dashboard")}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </button>
                    <button
                      className="px-5 py-2 rounded-full bg-green-600/20 hover:bg-green-600/30 text-white font-semibold text-sm transition-colors flex items-center gap-2"
                      onClick={() => rtr.push("/profile")}
                    >
                      <User size={16} />
                      Profile
                    </button>
                  </>
                )}
                <button
                  className="px-5 py-2 rounded-full bg-red-600/20 hover:bg-red-600/30 text-white font-semibold text-sm transition-colors flex items-center gap-2"
                  onClick={doLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <button
                className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors"
                onClick={() => rtr.push("/auth/login")}
              >
                Login
              </button>
            )}
          </div>

          <button
            className="md:hidden text-white hover:text-green-400 z-30"
            onClick={() => setMOpen(!mOpen)}
          >
            {mOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md rounded-2xl shadow-xl mx-4 overflow-hidden">
            <div className="flex flex-col py-2">
              {!isDash &&
                navItms.map((itm, idx) => (
                  <button
                    key={idx}
                    className="text-left px-6 py-4 text-white hover:bg-green-500/20 hover:text-green-400 transition-colors font-medium"
                    onClick={() => goTo(itm.path)}
                  >
                    {itm.label}
                  </button>
                ))}
              {usr ? (
                <>
                  <div className="px-6 py-3 text-white/60 text-sm border-b border-white/10">
                    {usr.name || usr.email}
                  </div>
                  {!isDash && (
                    <>
                      <button
                        className="text-left px-6 py-4 text-white hover:bg-green-500/20 hover:text-green-400 transition-colors font-medium flex items-center gap-2"
                        onClick={() => {
                          rtr.push("/dashboard");
                          setMOpen(false);
                        }}
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </button>
                      <button
                        className="text-left px-6 py-4 text-white hover:bg-green-500/20 hover:text-green-400 transition-colors font-medium flex items-center gap-2"
                        onClick={() => {
                          rtr.push("/profile");
                          setMOpen(false);
                        }}
                      >
                        <User size={16} />
                        Profile
                      </button>
                    </>
                  )}
                  <button
                    className="text-left px-6 py-4 text-red-400 hover:bg-red-500/20 transition-colors font-medium flex items-center gap-2"
                    onClick={doLogout}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="mx-6 my-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                  onClick={() => goTo("/auth/login")}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
