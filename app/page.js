"use client";

import { useRouter } from "next/navigation";
import * as fcl from "@onflow/fcl";
import { useUserStore } from "../utils/store";
import { useEffect } from "react";
import "../flow/config";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import Logo from "../components/Logo";
import LogoFLow from "../components/LogoFlow";

export default function Home() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => fcl.currentUser.subscribe(setUser), [setUser]);

  useEffect(() => {
    if (user?.loggedIn) {
      router.push("/dashboard");
    }
  }, [router, user]);

  return (
    <>
      <section className="bg-primary-800">
        <nav className="relative z-10 inset-x-0 top-0 w-full h-20 border-b border-lime/10 flex items-center justify-center">
          <div className="container px-4 lg:px-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="/" className="flex items-center gap-2">
                <Logo className="h-6 text-lime hover:text-white" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fcl.authenticate()}
                className="flex items-center gap-2 font-bold text-sm text-primary-800 bg-lime px-6 py-3 rounded-md hover:shadow-lg hover:shadow-lime/20 hover:-translate-y-px transition-all hover:contrast-125 cursor-pointer"
              >
                <LogoFLow />
                <span>Connect Wallet</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="container px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="pt-16 md:pt-0 pr-10 space-y-6">
              <div className="relative">
                <h1 className="relative text-4xl lg:text-5xl font-black leading-normal lg:leading-normal text-white">
                  <span className="text-lime relative">
                    Decentralized
                    <img src="/img/sketch.svg" alt="Sketch" className="w-full absolute -bottom-3" />
                  </span>{" "}
                  Blogging Platform Driven by AI
                </h1>
              </div>
              <p className="leading-relaxed text-lg text-white/80">
                Empowering writers with a decentralized, AI-driven blogging platform. Join us to transform the way you write, read, and engage with relevant
                content. Harness the power of blockchain and AI for an innovative blogging experience.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => fcl.authenticate()}
                  className="inline-flex items-center gap-2 group font-bold text-sm bg-lime text-primary-800 px-6 py-3 rounded-md hover:shadow-lg hover:shadow-lime/20 hover:-translate-y-px transition-all hover:contrast-125"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 256 256">
                    <path
                      fill="currentColor"
                      d="m234.8 89.9l-68.7-68.7a19.9 19.9 0 0 0-28.2 0l-24.5 24.5l-57.3 21.4a20.2 20.2 0 0 0-12.7 15.5L20.2 222A11.9 11.9 0 0 0 32 236l2-.2l139.4-23.2a20.2 20.2 0 0 0 15.5-12.7l21.4-57.2l24.5-24.6a19.9 19.9 0 0 0 0-28.2Zm-67.6 99.4L67 206l33.5-33.5a36 36 0 1 0-17-17L50 189L66.7 88.8L117 70l69.1 69ZM104 140a12 12 0 1 1 12 12a12 12 0 0 1-12-12Zm96-21l-63-63l15-15l63 63Z"
                    />
                  </svg>
                  <span>Start Writing</span>
                </button>
                <Link
                  href="/0xd39b16b459032658"
                  className="inline-flex items-center gap-2 group font-bold text-sm bg-primary-800 text-lime px-6 py-3 rounded-md hover:shadow-lg hover:shadow-primary-800/20 hover:-translate-y-px transition-all hover:contrast-125"
                >
                  <LayoutGrid className="w-5 h-5" />
                  <span>Explore</span>
                </Link>
              </div>
            </div>
            <div className="h-[40rem] relative">
              <img src="/img/bg-circle.svg" alt="circle" className="w-full absolute z-10 top-24 pl-20 pointer-events-none" />
              <img src="/img/write-bot.webp" alt="Writer" className="w-full absolute z-10 top-20 animate-updown pointer-events-none" />
            </div>
          </div>
        </div>
      </section>
      <section className="container px-4 lg:px-6 my-20" id="features">
        <div className="max-w-2xl">
          <h2 className="font-black text-4xl lg:text-6xl mb-8">
            Unleash Your Writing Potential with <span className="text-primary-800">PeerPost</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 border rounded-md bg-white border-gray-800/10 cursor-crosshair hover:bg-lime hover:shadow-lg hover:shadow-lime/50 hover:-translate-y-px hover:border-primary-800 transition-all group">
            <div className="w-12 h-12 rounded-md bg-lime border border-primary-800/10 flex items-center justify-center mb-4 group-hover:bg-primary-800 transition-all text-primary-800 group-hover:text-lime group-hover:scale-105 group-hover:-rotate-12 group-hover:shadow-xl delay-75 duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 48 48">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
                  <path d="M40 30V15L27.5 7.969m-7 0L8 15v15m3 4.688L24 42l8-4.5l5-2.813M21 18.75l-3 1.75v7l3 1.75L24 31l3-1.75l3-1.75v-7l-3-1.75L24 17l-3 1.75ZM24 17v-7m6 17l7 4m-19-4l-7 4" />
                  <circle cx="24" cy="7" r="3" />
                  <circle cx="8" cy="33" r="3" />
                  <circle cx="40" cy="33" r="3" />
                </g>
              </svg>
            </div>
            <h3 className="font-extrabold text-xl mb-2 text-primary-800">Decentralized Blogging</h3>
            <p className="opacity-80">
              Embrace the freedom of a decentralized platform where your content is securely stored and distributed across the blockchain network, ensuring
              transparency and censorship resistance.
            </p>
          </div>
          <div className="p-8 border rounded-md bg-white border-gray-800/10 cursor-crosshair hover:bg-lime hover:shadow-lg hover:shadow-lime/50 hover:-translate-y-px hover:border-primary-800 transition-all group">
            <div className="w-12 h-12 rounded-md bg-lime border border-primary-800/10 flex items-center justify-center mb-4 group-hover:bg-primary-800 transition-all text-primary-800 group-hover:text-lime group-hover:scale-105 group-hover:-rotate-12 group-hover:shadow-xl delay-75 duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M18.5 10.255c0 .044 0 .089-.003.133A1.537 1.537 0 0 0 17.473 10c-.162 0-.32.025-.473.074V5.75a.75.75 0 0 0-.75-.75h-8.5a.75.75 0 0 0-.75.75v4.505c0 .414.336.75.75.75h8.276l-.01.025l-.003.012l-.45 1.384l-.01.026a1.625 1.625 0 0 1-.019.053H7.75a2.25 2.25 0 0 1-2.25-2.25V5.75A2.25 2.25 0 0 1 7.75 3.5h3.5v-.75a.75.75 0 0 1 .649-.743L12 2a.75.75 0 0 1 .743.649l.007.101l-.001.75h3.5a2.25 2.25 0 0 1 2.25 2.25v4.505Zm-5.457 3.781l.112-.036H6.254a2.25 2.25 0 0 0-2.25 2.25v.907a3.75 3.75 0 0 0 1.305 2.844c1.563 1.343 3.802 2 6.691 2c2.076 0 3.817-.339 5.213-1.028a1.545 1.545 0 0 1-1.169-1.003l-.004-.012l-.03-.093c-1.086.422-2.42.636-4.01.636c-2.559 0-4.455-.556-5.713-1.638a2.25 2.25 0 0 1-.783-1.706v-.907a.75.75 0 0 1 .75-.75H12v-.003a1.543 1.543 0 0 1 1.031-1.456l.012-.005ZM10.999 7.75a1.25 1.25 0 1 0-2.499 0a1.25 1.25 0 0 0 2.499 0Zm3.243-1.25a1.25 1.25 0 1 1 0 2.499a1.25 1.25 0 0 1 0-2.499Zm1.847 10.912a2.831 2.831 0 0 0-1.348-.955l-1.377-.448a.544.544 0 0 1 0-1.025l1.377-.448a2.84 2.84 0 0 0 1.76-1.762l.01-.034l.449-1.377a.544.544 0 0 1 1.026 0l.448 1.377a2.837 2.837 0 0 0 1.798 1.796l1.378.448l.027.007a.544.544 0 0 1 0 1.025l-1.378.448a2.839 2.839 0 0 0-1.798 1.796l-.447 1.377a.55.55 0 0 1-.2.263a.544.544 0 0 1-.827-.263l-.448-1.377a2.834 2.834 0 0 0-.45-.848Zm7.694 3.801l-.765-.248a1.577 1.577 0 0 1-.999-.998l-.249-.765a.302.302 0 0 0-.57 0l-.249.764a1.577 1.577 0 0 1-.983.999l-.766.248a.302.302 0 0 0 0 .57l.766.249a1.576 1.576 0 0 1 .998 1.002l.25.764a.303.303 0 0 0 .57 0l.248-.764a1.575 1.575 0 0 1 1-.999l.765-.248a.302.302 0 0 0 0-.57l-.016-.004Z"
                />
              </svg>
            </div>
            <h3 className="font-extrabold text-xl mb-2 text-primary-800">AI-Assisted Writing</h3>
            <p className="opacity-80">
              Unlock your writing potential with AI-powered tools that provide suggestions, enhance your writing skills, and help you discover new ideas for
              engaging content.
            </p>
          </div>
          <div className="p-8 border rounded-md bg-white border-gray-800/10 cursor-crosshair hover:bg-lime hover:shadow-lg hover:shadow-lime/50 hover:-translate-y-px hover:border-primary-800 transition-all group">
            <div className="w-12 h-12 rounded-md bg-lime border border-primary-800/10 flex items-center justify-center mb-4 group-hover:bg-primary-800 transition-all text-primary-800 group-hover:text-lime group-hover:scale-105 group-hover:-rotate-12 group-hover:shadow-xl delay-75 duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24">
                <g fill="none" fillRule="evenodd">
                  <path d="M24 0v24H0V0h24ZM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01l-.184-.092Z" />
                  <path
                    fill="currentColor"
                    d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2ZM4.071 13.071a8.004 8.004 0 0 0 6.858 6.858A8.004 8.004 0 0 0 4.07 13.07Zm15.858 0a8.004 8.004 0 0 0-6.858 6.858a8.004 8.004 0 0 0 6.858-6.858ZM12 7.364A10.042 10.042 0 0 1 7.364 12A10.042 10.042 0 0 1 12 16.636A10.042 10.042 0 0 1 16.636 12A10.042 10.042 0 0 1 12 7.364Zm-1.071-3.293A8.005 8.005 0 0 0 4.07 10.93a8.004 8.004 0 0 0 6.86-6.86Zm2.142 0a8.004 8.004 0 0 0 6.858 6.858A8.004 8.004 0 0 0 13.07 4.07Z"
                  />
                </g>
              </svg>
            </div>
            <h3 className="font-extrabold text-xl mb-2 text-primary-800">Monetize Your Expertise</h3>
            <p className="opacity-80">
              With PeerPost, you have the option to set articles as free or paid, allowing you to generate revenue from your valuable insights and expertise.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
