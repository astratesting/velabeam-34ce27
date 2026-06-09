'use client';

interface StepBrandProps {
  agencyName: string;
  primaryColor: string;
  onAgencyNameChange: (name: string) => void;
  onPrimaryColorChange: (color: string) => void;
}

export default function StepBrand({
  agencyName,
  primaryColor,
  onAgencyNameChange,
  onPrimaryColorChange,
}: StepBrandProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-charcoal mb-2">Your brand</h2>
        <p className="text-sm text-fog">
          Set up your agency branding. This appears on all client-facing surfaces.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="agency-name" className="block text-sm text-fog mb-1">
            Agency name
          </label>
          <input
            id="agency-name"
            type="text"
            value={agencyName}
            onChange={(e) => onAgencyNameChange(e.target.value)}
            className="w-full py-3 px-0 border-b border-mist bg-transparent text-charcoal placeholder:text-fog/50 focus:border-gold focus:outline-none transition-colors"
            placeholder="Your Studio Name"
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm text-fog mb-2">
            Primary color
          </label>
          <div className="flex items-center gap-4">
            <input
              id="color"
              type="color"
              value={primaryColor}
              onChange={(e) => onPrimaryColorChange(e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border border-mist"
            />
            <div className="flex-1">
              <div className="flex gap-2">
                {['#B8956A', '#2563EB', '#059669', '#7C3AED', '#DC2626'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onPrimaryColorChange(c)}
                    className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      borderColor: primaryColor === c ? 'var(--charcoal)' : 'transparent',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-mist/30 rounded-lg">
        <p className="text-xs text-fog">
          These settings can be changed later in the Brand section of your dashboard.
        </p>
      </div>
    </div>
  );
}
