'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepLocation from '@/components/onboarding/StepLocation';
import StepIndustries from '@/components/onboarding/StepIndustries';
import StepBrand from '@/components/onboarding/StepBrand';
import BeamButton from '@/components/ui/BeamButton';
import { cn } from '@/lib/cn';

const steps = ['Location', 'Industries', 'Brand'];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1: Location
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState(25);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  // Step 2: Industries
  const [industries, setIndustries] = useState<string[]>([]);

  // Step 3: Brand
  const [agencyName, setAgencyName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#B8956A');

  const toggleIndustry = (key: string) => {
    setIndustries((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const canProceed = () => {
    if (currentStep === 0) return address.length > 0;
    if (currentStep === 1) return industries.length > 0;
    return true;
  };

  const handleNext = async () => {
    if (currentStep < 2) {
      setCurrentStep((s) => s + 1);
      return;
    }

    // Final step — save and redirect
    setLoading(true);
    try {
      // Save brand settings
      await fetch('/api/brand', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyName, primaryColor }),
      });

      // Trigger prospect scan
      await fetch('/api/prospects/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, radius: radius * 1609.34, industries }),
      });

      router.push('/dashboard/prospects');
    } catch {
      // Still redirect — the scan may fail without API keys
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-mist">
        <span className="font-display text-lg font-bold text-charcoal">VelaBeam</span>
        <div className="flex items-center gap-2">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  idx <= currentStep ? 'bg-gold' : 'bg-mist'
                )}
              />
              <span
                className={cn(
                  'text-xs',
                  idx === currentStep ? 'text-charcoal font-medium' : 'text-fog'
                )}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {currentStep === 0 && (
            <StepLocation
              address={address}
              radius={radius}
              onAddressChange={setAddress}
              onRadiusChange={setRadius}
              onLatChange={setLat}
              onLngChange={setLng}
            />
          )}
          {currentStep === 1 && (
            <StepIndustries selected={industries} onToggle={toggleIndustry} />
          )}
          {currentStep === 2 && (
            <StepBrand
              agencyName={agencyName}
              primaryColor={primaryColor}
              onAgencyNameChange={setAgencyName}
              onPrimaryColorChange={setPrimaryColor}
            />
          )}

          <div className="flex justify-between mt-12">
            {currentStep > 0 ? (
              <BeamButton variant="ghost" onClick={() => setCurrentStep((s) => s - 1)}>
                Back
              </BeamButton>
            ) : (
              <div />
            )}
            <BeamButton
              variant="primary"
              disabled={!canProceed()}
              loading={loading}
              onClick={handleNext}
            >
              {currentStep === 2 ? 'Find prospects' : 'Continue'}
            </BeamButton>
          </div>
        </div>
      </div>
    </div>
  );
}
