'use client';

import { useState } from 'react';

interface StepLocationProps {
  address: string;
  radius: number;
  onAddressChange: (address: string) => void;
  onRadiusChange: (radius: number) => void;
  onLatChange: (lat: number) => void;
  onLngChange: (lng: number) => void;
}

export default function StepLocation({
  address,
  radius,
  onAddressChange,
  onRadiusChange,
  onLatChange,
  onLngChange,
}: StepLocationProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddressSearch = async (value: string) => {
    onAddressChange(value);
    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // In dev without Google Places, show a mock suggestion
    setSuggestions([
      { description: value, lat: 34.0195, lng: -118.4912 },
      { description: `${value} (downtown)`, lat: 34.0522, lng: -118.2437 },
    ]);
    setShowSuggestions(true);
  };

  const selectSuggestion = (s: any) => {
    onAddressChange(s.description);
    onLatChange(s.lat);
    onLngChange(s.lng);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-charcoal mb-2">Where do you work?</h2>
        <p className="text-sm text-fog">
          Enter your business address or the area where you find clients. We&apos;ll search for prospects nearby.
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <label htmlFor="address" className="block text-sm text-fog mb-1">
            Business address or city
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => handleAddressSearch(e.target.value)}
            className="w-full py-3 px-0 border-b border-mist bg-transparent text-charcoal placeholder:text-fog/50 focus:border-gold focus:outline-none transition-colors"
            placeholder="e.g. 123 Main St, Los Angeles, CA"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 bg-ivory border border-mist rounded-md shadow-lg mt-1">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSuggestion(s)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-mist/30 transition-colors border-b border-mist/50 last:border-0"
                >
                  {s.description}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="radius" className="block text-sm text-fog mb-1">
            Search radius: {radius} miles
          </label>
          <input
            id="radius"
            type="range"
            min={5}
            max={100}
            step={5}
            value={radius}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="w-full h-1 bg-mist rounded-lg appearance-none cursor-pointer accent-gold"
          />
          <div className="flex justify-between text-xs text-fog mt-1">
            <span>5 mi</span>
            <span>50 mi</span>
            <span>100 mi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
