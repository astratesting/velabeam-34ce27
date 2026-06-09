export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left — dark panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/harbor-2.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/80 to-ink" />
        <div className="relative z-10 flex flex-col justify-center px-12">
          <h1 className="font-display text-4xl font-bold text-ivory mb-4">VelaBeam</h1>
          <p className="text-ivory/50 text-lg max-w-md">
            The automated pipeline that finds local businesses, builds their website, and ships it live.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-ivory">
        {children}
      </div>
    </div>
  );
}
