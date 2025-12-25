"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  const refL = useRef<HTMLDivElement | any>(undefined);
  const mRef = useRef<any>(undefined);
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomSrt = (cols: number, rows: number) => {
    let str = "";
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let idx = Math.floor(Math.random() * chars.length);
        str += chars[idx % chars.length];
      }
      if (i < rows - 1) str += "\n";
    }
    return str;
  };
  const calcNumber = () => {
    if (!refL.current) return { cols: 0, rows: 0 };
    const el = refL.current;
    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    const lineHeight = parseFloat(style.lineHeight);
    const charWidth = fontSize * 0.6;
    const charHeight = lineHeight;
    const cols = Math.floor(el.clientWidth / charWidth);
    const rows = Math.ceil(el.clientHeight / charHeight);
    return { cols, rows };
  };
  const inject = () => {
    if (refL.current) {
      const { cols, rows } = calcNumber();
      refL.current.innerText = randomSrt(cols, rows);
    }
  };
  const updateClip = (clientX: number) => {
    const width = (clientX / window.innerWidth) * 100;
    if (mRef.current) {
      mRef.current.style.clipPath = `inset(0 ${100 - width}% 0 0)`;
    }
  };
  const handleMouseMove = (e: MouseEvent) => {
    updateClip(e.clientX);
    inject();
  };
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      updateClip(e.touches[0].clientX);
      inject();
    }
  };
  useEffect(() => {
    inject();
    addEventListener("mousemove", handleMouseMove);
    addEventListener("touchmove", handleTouchMove);
    return () => {
      removeEventListener("mousemove", handleMouseMove);
      removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={mRef}
        className="absolute inset-0 h-screen w-full flex justify-center items-center"
      >
        <div
          ref={refL}
          className="absolute inset-0 bg-black text-green-950 overflow-hidden
                     font-mono text-sm leading-tight whitespace-pre"
        />
        <div className="mt-10 relative z-10 flex flex-col items-center gap-4 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="fancy inline">Detect</span>
            <br />
            <span>Vulnerabilities</span>
            <br />
            Efficiently
          </h1>
          <p className="text-lg md:text-xl text-green-200 max-w-2xl mt-4">
            Streamlined issue tracking and management for your security team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/auth/register"
              className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-8 py-4 text-lg font-semibold text-white transition"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 rounded-lg border-2 border-green-600 hover:bg-green-600/10 px-8 py-4 text-lg font-semibold text-green-600 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="gradient-bg h-screen w-full flex justify-center items-center">
        <div className="mt-10 flex flex-col items-center gap-4 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="fancy">Report</span>
            <br />
            <span>Vulnerabilities</span>
            <br />
            Efficiently
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mt-4">
            Streamlined issue tracking and management for your security team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/auth/register"
              className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-8 py-4 text-lg font-semibold text-white transition"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 rounded-lg border-2 border-green-600 hover:bg-green-600/10 px-8 py-4 text-lg font-semibold text-green-600 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
