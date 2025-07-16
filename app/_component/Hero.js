"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-[#fae3fc] to-[#a9c3eb] py-12 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1
          className="font-extrabold text-gray-900 tracking-tight"
          style={{ fontSize: "4.5rem", lineHeight: "1.1" }}
        >
          Simplify <span className="text-red-500">PDF</span>{" "}
          <span className="text-blue-500">Note</span>-Taking
          <br />
          with <span className="text-gray-900">AI-Powered</span>
        </h1>

        <p className="mt-8 text-xl text-gray-800 max-w-3xl mx-auto">
          Elevate your note-taking experience with our powerful AI app.
          Seamlessly extract insights, summaries, and annotations from any PDF
          in just a few clicks.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/dashboard">
            <button className="px-10 py-4 bg-black text-white rounded-full text-lg font-semibold hover:bg-gray-800 transition-all">
              Get Started
            </button>
          </Link>
          <button className="px-10 py-4 bg-white border border-gray-300 text-lg font-semibold rounded-full hover:bg-gray-100 transition-all">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
