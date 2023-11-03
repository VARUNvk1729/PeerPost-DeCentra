"use client";
import "../flow/config";
import * as fcl from "@onflow/fcl";
import { Wallet } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { useUserStore } from "../utils/store";
import { JetBrains_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import LogoFLow from "./LogoFlow";
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function Navbar() {
  const user = useUserStore((state) => state.user);
	const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);
	
  return domLoaded && (
    <nav className="relative z-10 inset-x-0 top-0 w-full h-16 border-b border-lime/10 flex items-center justify-center bg-primary-800">
      <div className="container px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6 text-lime hover:text-white" />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {user && user.loggedIn ? (
            <Link className={`text-lime font-bold flex items-center gap-2 ${mono.className}`} href="/dashboard">
              <img
                src={`https://source.boringavatars.com/beam/120/${user?.addr ?? 1}?colors=DEECA3,f4a261,e76f51`}
                alt="Photo"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">{user?.addr}</span>
            </Link>
          ) : (
            <button
              onClick={() => fcl.authenticate()}
              className="flex items-center gap-2 font-bold text-sm text-primary-800 bg-lime px-6 py-3 rounded-md hover:shadow-lg hover:shadow-lime/20 hover:-translate-y-px transition-all hover:contrast-125 cursor-pointer"
            >
              <LogoFLow />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
