"use client";
import Link from "next/link";
import { Flame } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Flame className="h-7 w-7 text-orange-500" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              ジャパン プロレスマニア
            </h1>
            <p className="text-[10px] text-gray-500 tracking-widest">
              JAPAN PRO WRESTLING MANIA
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
