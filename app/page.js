import HomePageHeader from "./_component/HomePageHeader";
import Hero from "./_component/Hero";

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      <HomePageHeader />
      <Hero />

      {/* Bottom section */}
      <section className="bg-gradient-to-r from-[#fae3fc] to-[#a9c3eb] py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              The lowest price
            </h3>
            <p className="mt-1 text-gray-600 text-sm">
              Affordable pricing tailored for students, freelancers, and teams.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              The fastest on the market
            </h3>
            <p className="mt-1 text-gray-600 text-sm">
              Lightning-fast PDF parsing and summarization powered by AI.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              The most loved
            </h3>
            <p className="mt-1 text-gray-600 text-sm">
              Trusted by thousands for note-taking, research, and productivity.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
