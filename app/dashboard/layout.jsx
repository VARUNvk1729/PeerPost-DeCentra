"use client";

import * as fcl from "@onflow/fcl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "../../utils/store";
import Logo from "../../components/Logo";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const handleUnauthenticate = () => {
    setUser(null);
    fcl.unauthenticate();
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <>
      {domLoaded && (
        <div>
          {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-10 bg-primary-800/25 backdrop-blur"></div>}

          <div
            className={`z-10 lg:translate-x-0 fixed inset-y-0 left-0 min-h-screen w-64 bg-primary-800 flex flex-col transition-all ${
              open ? "-translate-x-0" : "-translate-x-64"
            }`}
          >
            <div className="shrink-0 h-16 border-b border-lime/10 flex items-center px-4 justify-center">
              <a href="/" className="flex items-center gap-3">
                <Logo className="h-6 text-lime hover:text-white" />
              </a>
            </div>
            <div className="h-full flex flex-col justify-between">
              <ul className="p-4 space-y-2">
                <li>
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 p-3 rounded-md font-bold text-sm ${
                      pathname === "/dashboard"
                        ? "bg-gradient-to-r from-lime to-lime/70 text-primary-800 hover:shadow hover:shadow-lime"
                        : "bg-transparent text-white hover:text-lime"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 256 256">
                      <path
                        fill="currentColor"
                        d="M208 228h-48a20.1 20.1 0 0 1-20-20v-44h-24v44a20.1 20.1 0 0 1-20 20H48a20.1 20.1 0 0 1-20-20v-92.5a20 20 0 0 1 6.6-14.8L114.5 28a20 20 0 0 1 27 0l80 72.7a20.3 20.3 0 0 1 6.5 14.8V208a20.1 20.1 0 0 1-20 20Zm-44-24h40v-86.7l-76-69.1l-76 69.1V204h40v-44a20.1 20.1 0 0 1 20-20h32a20.1 20.1 0 0 1 20 20Z"
                      />
                    </svg>
                    <span className="opacity-80">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/article"
                    id="sec-menu-article"
                    className={`flex items-center gap-3 p-3 rounded-md font-bold text-sm ${
                      pathname === "/dashboard/article"
                        ? "bg-gradient-to-r from-lime to-lime/70 text-primary-800 hover:shadow hover:shadow-lime"
                        : "bg-transparent text-white hover:text-lime"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 256 256">
                      <path
                        fill="currentColor"
                        d="m216.5 79.5l-56-56A12.3 12.3 0 0 0 152 20H56a20.1 20.1 0 0 0-20 20v176a20.1 20.1 0 0 0 20 20h144a20.1 20.1 0 0 0 20-20V88a12.3 12.3 0 0 0-3.5-8.5ZM160 57l23 23h-23ZM60 212V44h76v48a12 12 0 0 0 12 12h48v108Zm112-80a12 12 0 0 1-12 12H96a12 12 0 0 1 0-24h64a12 12 0 0 1 12 12Zm0 40a12 12 0 0 1-12 12H96a12 12 0 0 1 0-24h64a12 12 0 0 1 12 12Z"
                      />
                    </svg>
                    <span className="opacity-80">My Articles</span>
                  </Link>
                </li>
              </ul>
              <div className="p-4">
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      <img
                        src={`https://source.boringavatars.com/beam/120/${user?.addr ?? 1}?colors=DEECA3,f4a261,e76f51`}
                        alt="Photo"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                    <div>
                      {/* <h6 className="font-bold text-white text-sm">Name</h6> */}
                      <p className="text-xs text-white/80">{user?.addr}</p>
                    </div>
                  </div>
                  <button onClick={handleUnauthenticate}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-lime hover:text-white" viewBox="0 0 256 256">
                      <path
                        fill="currentColor"
                        d="m224.5 136.5l-42 42a12 12 0 0 1-8.5 3.5a12.2 12.2 0 0 1-8.5-3.5a12 12 0 0 1 0-17L187 140h-83a12 12 0 0 1 0-24h83l-21.5-21.5a12 12 0 0 1 17-17l42 42a12 12 0 0 1 0 17ZM104 204H52V52h52a12 12 0 0 0 0-24H48a20.1 20.1 0 0 0-20 20v160a20.1 20.1 0 0 0 20 20h56a12 12 0 0 0 0-24Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:ml-64">
            <div className="h-16 bg-white border-b flex items-center px-4">
              <div className="w-full flex items-center justify-between">
                <div className="flex gap-3">
                  <button className="block lg:hidden" onClick={() => setOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </button>
                  {/* <h1 className="font-extrabold text-base md:text-lg">Dashboard</h1> */}
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard/article/new"
                    className="flex items-center gap-2 font-bold text-sm text-lime bg-primary-800 px-4 py-2.5 rounded-md hover:shadow-lg hover:shadow-primary-800/20 hover:-translate-y-px transition-all hover:contrast-125"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 256 256">
                      <path
                        fill="currentColor"
                        d="m234.8 89.9l-68.7-68.7a19.9 19.9 0 0 0-28.2 0l-24.5 24.5l-57.3 21.4a20.2 20.2 0 0 0-12.7 15.5L20.2 222A11.9 11.9 0 0 0 32 236l2-.2l139.4-23.2a20.2 20.2 0 0 0 15.5-12.7l21.4-57.2l24.5-24.6a19.9 19.9 0 0 0 0-28.2Zm-67.6 99.4L67 206l33.5-33.5a36 36 0 1 0-17-17L50 189L66.7 88.8L117 70l69.1 69ZM104 140a12 12 0 1 1 12 12a12 12 0 0 1-12-12Zm96-21l-63-63l15-15l63 63Z"
                      />
                    </svg>
                    <span className="hidden md:block">Write New</span>
                  </Link>
                </div>
              </div>
            </div>

            <main className="p-4 md:p-6">{children}</main>
          </div>
        </div>
      )}
    </>
  );
}
