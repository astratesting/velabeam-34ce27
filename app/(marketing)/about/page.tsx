export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-display text-4xl font-bold text-charcoal mb-8">About VelaBeam</h1>

      <div className="space-y-8 text-fog leading-relaxed">
        <p>
          VelaBeam was built to solve a specific problem: freelance web developers and small agencies spend too much time on prospecting and not enough time building.
        </p>
        <p>
          The workflow is broken. Cold outreach, manual briefs, WordPress installs, revision rounds — the economics of building sites for local businesses barely work at scale. Meanwhile, millions of local businesses still don&apos;t have a website.
        </p>
        <p>
          VelaBeam collapses the entire acquisition-to-deploy pipeline into a single session. Find a prospect, generate a site, preview it, hand it off. What used to take a week now takes minutes.
        </p>
        <div className="py-8 border-y border-gold/30">
          <h2 className="font-display text-2xl font-bold text-charcoal mb-4">Studio of N</h2>
          <p className="text-sm">
            VelaBeam is built by a small, focused team. We&apos;re growing. If you&apos;re interested in contributing, reach out.
          </p>
        </div>
        <p>
          We believe every local business deserves a professional online presence, and every developer deserves tools that respect their time.
        </p>
      </div>
    </div>
  );
}
