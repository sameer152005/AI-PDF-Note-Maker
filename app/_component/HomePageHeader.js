"use client";
import Image from "next/image";
import Link from "next/link";

export default function HomePageHeader() {
  return (
    <nav className="w-full bg-gradient-to-r from-[#fae3fc] to-[#a9c3eb] backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            AI-PDF
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[16px] text-gray-700 font-medium">
          <a href="#features" className="hover:text-black">Features</a>
          <a href="#solution" className="hover:text-black">Solution</a>
          <a href="#testimonials" className="hover:text-black">Testimonials</a>
          <a href="#blog" className="hover:text-black">Blog</a>
          <Link href="/dashboard">
            <button className="ml-4 px-5 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
